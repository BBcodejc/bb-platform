import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { verifyWebhookSignature } from '@/lib/stripe';
import Stripe from 'stripe';

const NOTIFICATION_EMAIL = 'bbcodejc@gmail.com';
const FROM_EMAIL = 'Jake from BB <jake@trainwjc.com>';
const REPLY_TO_EMAIL = 'bbcodejc@gmail.com';

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
        from: FROM_EMAIL,
        reply_to: REPLY_TO_EMAIL,
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

  const supabase = createServiceRoleClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Support both programmatic checkout (metadata) and Payment Links (client_reference_id)
        let prospectId = session.metadata?.prospect_id || session.client_reference_id;
        const productType = session.metadata?.product_type;

        // If no prospect ID from metadata or client_reference_id, look up by email
        if (!prospectId) {
          const customerEmail = session.customer_email || session.customer_details?.email;
          if (customerEmail) {
            const { data: prospectByEmail } = await supabase
              .from('prospects')
              .select('id')
              .eq('email', customerEmail)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            if (prospectByEmail) {
              prospectId = prospectByEmail.id;
              console.log(`Found prospect by email ${customerEmail}: ${prospectId}`);
            }
          }
        }

        if (!prospectId) {
          console.error('No prospect found via metadata, client_reference_id, or email lookup');
          break;
        }

        // Update payment record (if exists from programmatic checkout)
        await supabase
          .from('payments')
          .update({
            status: 'succeeded',
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('stripe_checkout_session_id', session.id);

        // Also insert a payment record for Payment Link purchases (no prior record exists)
        const { data: existingPayment } = await supabase
          .from('payments')
          .select('id')
          .eq('stripe_checkout_session_id', session.id)
          .single();

        if (!existingPayment) {
          await supabase.from('payments').insert({
            prospect_id: prospectId,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            amount: session.amount_total || 25000,
            currency: session.currency || 'usd',
            status: 'succeeded',
            product_type: productType || 'shooting_eval',
          });
        }

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

          // Send customer confirmation email with detailed instructions
          await sendEmailNotification(
            'Your BB Shooting Evaluation - Next Steps Inside',
            `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: #d4af37; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .step { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #d4af37; }
    .step-number { background: #d4af37; color: black; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; }
    .test-box { background: #1a1a1a; color: white; padding: 20px; margin: 10px 0; border-radius: 8px; }
    .test-title { color: #d4af37; font-weight: bold; margin-bottom: 10px; }
    .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; background: #d4af37; color: black; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">BASKETBALL BIOMECHANICS</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Your BB Shooting Evaluation</p>
    </div>

    <div class="content">
      <h2 style="color: #1a1a1a;">Hey ${prospect.first_name}!</h2>
      <p>Your payment is confirmed. Let's get you dialed in. Here's exactly what to do next:</p>

      <div class="highlight">
        <strong>Complete within 48 hours</strong> - The sooner you submit, the sooner you get your personalized BB Profile and roadmap.
      </div>

      <div class="step">
        <h3><span class="step-number">1</span> Complete the BB Standard Session</h3>
        <p>Find a gym, grab a ball, and run through these 4 tests. Film each one.</p>

        <div class="test-box">
          <div class="test-title">TEST 1: 14-Spot Baseline (3 Rounds)</div>
          <ul>
            <li>Shoot from all 14 spots around the arc</li>
            <li>Corner, Wing, slot, top of key, other slot, other wing, other corner, double up and come back around</li>
            <li>1 shot per spot, 3 full rounds</li>
            <li>Track makes and note your miss tendencies (short, long, left, right)</li>
          </ul>
        </div>

        <div class="test-box">
          <div class="test-title">TEST 2: Deep Distance Test</div>
          <ul>
            <li>Start at the 3-point line, take 5 shots</li>
            <li>Step back 1 step, take 5 more shots</li>
            <li>Keep stepping back until you can't reach the rim cleanly</li>
            <li>Note how many steps back and rim contacts at each distance</li>
          </ul>
        </div>

        <div class="test-box">
          <div class="test-title">TEST 3: Back-Rim Challenge</div>
          <ul>
            <li>Shoot 3's with the goal of hitting BACK RIM only</li>
            <li>Level 1: Hit 1 back-rim shot + consecutive make</li>
            <li>Level 2: Hit 2 back-rim shots + consecutive make</li>
            <li>Level 3: Hit 3 back-rim shots + consecutive make</li>
            <li>Track attempts and time for each level</li>
          </ul>
        </div>

        <div class="test-box">
          <div class="test-title">TEST 4: Ball Flight Spectrum</div>
          <ul>
            <li>Complete 3 more 14 spot test outs</li>
            <li>Round 1: FLAT arc</li>
            <li>Round 2: NORMAL arc</li>
            <li>Round 3: HIGH arc</li>
            <li>Note makes and miss profile for each arc type</li>
          </ul>
        </div>
      </div>

      <div class="step">
        <h3><span class="step-number">2</span> Film Requirements</h3>
        <ul>
          <li><strong>Angle:</strong> Side view (dominant hand side) so we can see your full release</li>
          <li><strong>Distance:</strong> Full body visible, close enough to see hand position</li>
          <li><strong>Quality:</strong> Good lighting, stable camera (tripod or friend holding)</li>
          <li><strong>Include:</strong> All 4 tests in separate clips or one continuous video</li>
        </ul>
        <p style="font-size: 13px; color: #666; margin-top: 10px;"><em>*Every test doesn't have to be filmed just make sure you capture reps from each test.</em></p>
      </div>

      <div class="step">
        <h3><span class="step-number">3</span> Submit Your Results</h3>
        <p>Click the button below to access your personal evaluation portal. Enter your test results and upload your videos directly:</p>

        <div style="text-align: center; margin: 25px 0;">
          <a href="https://bb-platform-virid.vercel.app/portal/${prospectId}" class="button" style="display: inline-block; background: #d4af37; color: black; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Access Your Evaluation Portal →
          </a>
        </div>

        <p style="font-size: 14px; color: #666; text-align: center;">
          Your unique portal link: <a href="https://bb-platform-virid.vercel.app/portal/${prospectId}">bb-platform-virid.vercel.app/portal/${prospectId}</a>
        </p>
      </div>

      <div class="step">
        <h3><span class="step-number">4</span> What Happens Next</h3>
        <ul>
          <li>We review your film and test results</li>
          <li>You receive your personalized BB Profile within 5 business days</li>
          <li>Your profile includes: BB Level, Miss Profile, Priority Protocols, and personalized Week of Calibration</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>Questions?</strong> Just reply directly to this email and I'll get back to you.
      </div>

      <p style="margin-top: 30px;">Let's get to work.</p>
      <p style="color: #d4af37; font-weight: bold;">— Coach Jake & the BB Team</p>
    </div>

    <div class="footer">
      <p>Basketball Biomechanics</p>
      <p style="font-size: 12px; color: #999;">You're receiving this because you purchased a BB Shooting Evaluation.</p>
    </div>
  </div>
</body>
</html>
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
