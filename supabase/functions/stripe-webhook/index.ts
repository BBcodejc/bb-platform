// Supabase Edge Function: Stripe Webhook Handler
// Deploy with: supabase functions deploy stripe-webhook
// Set webhook endpoint in Stripe Dashboard: https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook

import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

// Crypto provider for webhook signature verification in Deno
const cryptoProvider: Stripe.CryptoProvider = {
  async computeHMACSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  },
  computeHMACSignatureAsync(payload: string, secret: string): Promise<string> {
    return this.computeHMACSignature(payload, secret);
  },
};

Deno.serve(async (req: Request) => {
  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Get raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return new Response('Missing signature', { status: 400 });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '',
        undefined,
        cryptoProvider
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, {
        status: 400,
      });
    }

    // Initialize Supabase admin client
    const supabase = getSupabaseAdmin();

    console.log(`Processing webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      // ========================================
      // CHECKOUT SESSION COMPLETED
      // ========================================
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('Checkout completed:', session.id);

        const prospectId = session.metadata?.prospect_id;
        const productType = session.metadata?.product_type;
        const isHighTicket = session.metadata?.high_ticket === 'true';

        if (!prospectId) {
          console.error('Missing prospect_id in session metadata');
          break;
        }

        // Update payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent as string,
            stripe_subscription_id: session.subscription as string,
            completed_at: new Date().toISOString(),
            metadata: {
              customer_email: session.customer_details?.email,
              customer_name: session.customer_details?.name,
              payment_status: session.payment_status,
            },
          })
          .eq('stripe_checkout_session_id', session.id);

        if (paymentError) {
          console.error('Payment update error:', paymentError);
        }

        // Update prospect status
        const { error: prospectError } = await supabase
          .from('prospects')
          .update({
            pipeline_status: 'paid',
            high_ticket_prospect: isHighTicket,
            last_activity_at: new Date().toISOString(),
          })
          .eq('id', prospectId);

        if (prospectError) {
          console.error('Prospect update error:', prospectError);
        }

        // Create evaluation record if it's an evaluation product
        if (productType === 'shooting_eval' || productType === 'complete_eval') {
          const { error: evalError } = await supabase.from('evaluations').insert({
            prospect_id: prospectId,
            status: 'pending_submission',
          });

          if (evalError && !evalError.message.includes('duplicate')) {
            console.error('Evaluation creation error:', evalError);
          }
        }

        // Create mentorship record if it's a mentorship product
        if (productType === 'mentorship' || productType === 'mentorship_subscription') {
          const { error: mentorshipError } = await supabase.from('mentorships').insert({
            prospect_id: prospectId,
            program_type: '3_month_blueprint',
            price: session.amount_total,
            status: 'pending_contract',
          });

          if (mentorshipError && !mentorshipError.message.includes('duplicate')) {
            console.error('Mentorship creation error:', mentorshipError);
          }
        }

        // Log activity
        await supabase.from('activity_log').insert({
          prospect_id: prospectId,
          action: 'payment_completed',
          entity_type: 'payment',
          entity_id: session.id,
          new_value: {
            amount: session.amount_total,
            product_type: productType,
            payment_intent: session.payment_intent,
          },
          description: `Payment of $${(session.amount_total ?? 0) / 100} completed for ${productType}`,
        });

        break;
      }

      // ========================================
      // CHECKOUT SESSION EXPIRED
      // ========================================
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('Checkout expired:', session.id);

        // Update payment status
        await supabase
          .from('payments')
          .update({
            status: 'expired',
            metadata: { expired_at: new Date().toISOString() },
          })
          .eq('stripe_checkout_session_id', session.id);

        break;
      }

      // ========================================
      // PAYMENT INTENT SUCCEEDED (Backup)
      // ========================================
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log('Payment intent succeeded:', paymentIntent.id);

        // Update any payment with this intent
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        break;
      }

      // ========================================
      // PAYMENT INTENT FAILED
      // ========================================
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log('Payment failed:', paymentIntent.id);

        await supabase
          .from('payments')
          .update({
            status: 'failed',
            failure_reason: paymentIntent.last_payment_error?.message ?? 'Unknown error',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        break;
      }

      // ========================================
      // SUBSCRIPTION EVENTS
      // ========================================
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        console.log('Subscription event:', event.type, subscription.id);

        // Update payment record
        await supabase
          .from('payments')
          .update({
            subscription_status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        console.log('Subscription cancelled:', subscription.id);

        // Update payment status
        await supabase
          .from('payments')
          .update({
            subscription_status: 'cancelled',
          })
          .eq('stripe_subscription_id', subscription.id);

        // Update mentorship if exists
        const prospectId = subscription.metadata?.prospect_id;
        if (prospectId) {
          await supabase
            .from('mentorships')
            .update({
              status: 'cancelled',
              cancellation_reason: 'Subscription cancelled',
            })
            .eq('prospect_id', prospectId)
            .eq('status', 'active');
        }

        break;
      }

      // ========================================
      // REFUND EVENTS
      // ========================================
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;

        console.log('Charge refunded:', charge.id);

        // Find payment by payment intent
        if (charge.payment_intent) {
          await supabase
            .from('payments')
            .update({
              status: 'refunded',
              refunded_at: new Date().toISOString(),
              refund_reason: charge.refunds?.data[0]?.reason ?? 'Refund processed',
            })
            .eq('stripe_payment_intent_id', charge.payment_intent);
        }

        break;
      }

      // ========================================
      // INVOICE EVENTS (for subscriptions)
      // ========================================
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;

        console.log('Invoice paid:', invoice.id);

        if (invoice.subscription) {
          await supabase
            .from('payments')
            .update({
              status: 'completed',
            })
            .eq('stripe_subscription_id', invoice.subscription);
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        console.log('Invoice payment failed:', invoice.id);

        if (invoice.subscription) {
          await supabase
            .from('payments')
            .update({
              status: 'failed',
              failure_reason: 'Invoice payment failed',
            })
            .eq('stripe_subscription_id', invoice.subscription);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Webhook handler failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
