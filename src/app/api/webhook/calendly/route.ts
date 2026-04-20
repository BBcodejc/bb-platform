import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Verify Calendly webhook signature.
 * If CALENDLY_WEBHOOK_SECRET is not set, reject all requests.
 */
function verifyCalendlySignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;

  // If no secret configured, reject — fail closed
  if (!secret) {
    console.error('[Calendly Webhook] CALENDLY_WEBHOOK_SECRET not configured — rejecting request');
    return false;
  }

  const signature = request.headers.get('calendly-webhook-signature');
  if (!signature) return false;

  // Calendly signature format: t=timestamp,v1=hash
  const parts: Record<string, string> = {};
  for (const part of signature.split(',')) {
    const [key, value] = part.split('=');
    if (key && value) parts[key] = value;
  }

  const timestamp = parts['t'];
  const expectedSig = parts['v1'];
  if (!timestamp || !expectedSig) return false;

  // Reject if timestamp is older than 5 minutes (replay attack protection)
  const tolerance = 5 * 60 * 1000; // 5 minutes
  if (Math.abs(Date.now() - parseInt(timestamp) * 1000) > tolerance) {
    console.error('[Calendly Webhook] Timestamp too old — possible replay attack');
    return false;
  }

  const payload = `${timestamp}.${rawBody}`;
  const computedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSig),
    Buffer.from(computedSig)
  );
}

// POST /api/webhook/calendly — called by Calendly when someone books
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify webhook signature
    if (!verifyCalendlySignature(request, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Calendly sends the event type in the top-level `event` field
    const eventType = body.event;

    // We only care about new bookings
    if (eventType !== 'invitee.created') {
      return NextResponse.json({ ok: true, skipped: true, reason: `Event type: ${eventType}` });
    }

    // Extract invitee info from payload
    const inviteeEmail = body.payload?.invitee?.email?.toLowerCase()?.trim();
    const inviteeName = body.payload?.invitee?.name || '';

    if (!inviteeEmail) {
      console.error('[Calendly Webhook] No invitee email found in payload');
      return NextResponse.json({ error: 'No invitee email in payload' }, { status: 400 });
    }

    console.log(`[Calendly Webhook] Booking received: ${inviteeName} <${inviteeEmail}>`);

    const supabase = createServiceRoleClient();

    // 1. Find the prospect by email and update pipeline_status
    const { data: prospect, error: prospectError } = await supabase
      .from('prospects')
      .update({ pipeline_status: 'call_booked', updated_at: new Date().toISOString() })
      .eq('email', inviteeEmail)
      .select('id, first_name, last_name')
      .single();

    if (prospectError) {
      // Prospect might not exist (e.g., direct Calendly booking without application)
      console.log(`[Calendly Webhook] Prospect not found for ${inviteeEmail} — may be a direct booking`);
    } else {
      console.log(`[Calendly Webhook] Updated prospect ${prospect.first_name} ${prospect.last_name} to call_booked`);

      // Log activity
      await supabase.from('activity_log').insert({
        prospect_id: prospect.id,
        action: 'call_booked',
        entity_type: 'prospect',
        entity_id: prospect.id,
        description: `Call booked via Calendly by ${inviteeName || inviteeEmail}`,
      });
    }

    // 2. Cancel any active email sequences for this email
    const { data: cancelledSeqs, error: seqError } = await supabase
      .from('email_sequences')
      .update({ status: 'completed' })
      .eq('email', inviteeEmail)
      .eq('status', 'active')
      .select('id');

    if (seqError) {
      console.error('[Calendly Webhook] Error cancelling sequences:', seqError);
    } else if (cancelledSeqs && cancelledSeqs.length > 0) {
      console.log(`[Calendly Webhook] Cancelled ${cancelledSeqs.length} active email sequence(s) for ${inviteeEmail}`);
    }

    return NextResponse.json({
      ok: true,
      prospectUpdated: !!prospect,
      sequencesCancelled: cancelledSeqs?.length || 0,
    });
  } catch (error) {
    console.error('[Calendly Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
