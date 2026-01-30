import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { verifyWebhookSignature } from '@/lib/stripe';
import Stripe from 'stripe';

const NOTIFICATION_EMAIL = 'jake@basketballbiomechanics.com';

// Send email notification using Resend (or fallback to console log if not configured)
async function sendEmailNotification(subject: string, html: string, toEmail?: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = toEmail || NOTIFICATION_EMAIL;

  if (!resendApiKey) {
    console.log('========== EMAIL NOTIFICATION ==========');
    console.log('To:', recipient);
    console.log('Subject:', subject);
    console.log('Body:', html);
    console.log('=========================================');
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BB Platform <notifications@basketballbiomechanics.com>',
        to: recipient,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
    }
  } catch (error) {
    console.error('Email send error:', error);
  }
}

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

        // Get prospect details for email
        const { data: prospect } = await supabase
          .from('prospects')
          .select('first_name, last_name, email')
          .eq('id', prospectId)
          .single();

        if (prospect) {
          // Send admin notification
          await sendEmailNotification(
            `New Paid Evaluation - ${prospect.first_name} ${prospect.last_name}`,
            `
              <h2>New BB Shooting Evaluation Payment</h2>
              <p><strong>Customer:</strong> ${prospect.first_name} ${prospect.last_name}</p>
              <p><strong>Email:</strong> ${prospect.email}</p>
              <p><strong>Product:</strong> ${productType || 'shooting_eval'}</p>
              <p><strong>Amount:</strong> $${(session.amount_total || 0) / 100}</p>
              <hr />
              <p>The customer should receive video submission instructions. Check the admin dashboard for details.</p>
              <p style="color: #888; font-size: 12px;">Payment ID: ${session.payment_intent}</p>
            `
          );

          // Send customer confirmation email
          await sendEmailNotification(
            'Your BB Shooting Evaluation is Confirmed!',
            `
              <h2>Thanks for your purchase, ${prospect.first_name}!</h2>
              <p>Your BB Shooting Evaluation is confirmed and we're excited to help you improve your shot.</p>
              <hr />
              <h3>Next Steps:</h3>
              <ol>
                <li><strong>Record your videos</strong> - You'll receive detailed instructions shortly on what to record.</li>
                <li><strong>Submit within 48 hours</strong> - The sooner you submit, the sooner you'll get your personalized BB Profile.</li>
                <li><strong>Get your results</strong> - Your BB Profile will be delivered within 5 business days after submission.</li>
              </ol>
              <hr />
              <p>If you have any questions, reply to this email or reach out to jake@basketballbiomechanics.com</p>
              <p style="color: #b8860b; font-weight: bold;">Basketball Biomechanics</p>
            `,
            prospect.email
          );
        }

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
