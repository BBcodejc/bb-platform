import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { verifyWebhookSignature } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = verifyWebhookSignature(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const prospectId = session.metadata?.prospect_id;
        const productType = session.metadata?.product_type;

        if (!prospectId) {
          console.error('No prospect_id in session metadata');
          break;
        }

        // Update payment record
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('stripe_checkout_session_id', session.id);

        // Update prospect status
        await supabase
          .from('prospects')
          .update({
            pipeline_status: 'paid',
            updated_at: new Date().toISOString(),
          })
          .eq('id', prospectId);

        // Create evaluation record
        await supabase.from('evaluations').insert({
          prospect_id: prospectId,
          status: 'pending',
        });

        // TODO: Trigger email with test protocol instructions
        // TODO: Create Google Drive folder
        console.log(`Payment completed for prospect ${prospectId}`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update payment record
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_checkout_session_id', session.id);

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
