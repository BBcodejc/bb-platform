import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { sendGmailEmail } from '@/lib/gmail';
import {
  getEmail2Template,
  getEmail3Template,
  EMAIL_SEQUENCE_CONFIG,
} from '@/lib/email-templates';
import type { ApplicationType } from '@/lib/email-templates';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60s on Vercel Pro

// Vercel Cron endpoint — runs every hour to process delayed emails
export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();
  const results = { email2Sent: 0, email2Failed: 0, email3Sent: 0, email3Failed: 0 };

  try {
    // ─── PROCESS EMAIL 2 (24h after submission) ──────────────────
    const { data: dueEmail2 } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('status', 'active')
      .is('email_2_sent_at', null)
      .not('email_1_sent_at', 'is', null) // Only if Email 1 was sent
      .lte('email_2_scheduled_for', now)
      .lt('retry_count', EMAIL_SEQUENCE_CONFIG.MAX_RETRIES)
      .limit(50);

    for (const seq of dueEmail2 || []) {
      // Check if prospect already booked a call — skip if so
      const { data: prospect } = await supabase
        .from('prospects')
        .select('pipeline_status')
        .eq('id', seq.prospect_id)
        .single();

      if (prospect?.pipeline_status === 'call_booked') {
        await supabase.from('email_sequences').update({
          status: 'completed',
          email_2_error: 'Skipped — prospect already booked a call',
        }).eq('id', seq.id);

        await supabase.from('activity_log').insert({
          prospect_id: seq.prospect_id,
          action: 'email_sequence_skipped_booked',
          entity_type: 'email_sequence',
          entity_id: seq.id,
          description: 'Email 2 skipped — prospect already booked a call',
        });
        continue;
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bb-platform-virid.vercel.app';
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${seq.unsubscribe_token}`;

      const template = getEmail2Template({
        firstName: seq.first_name || '',
        applicationType: seq.application_type as ApplicationType,
        unsubscribeUrl,
      });

      const result = await sendGmailEmail({
        to: seq.email,
        subject: template.subject,
        text: template.text,
      });

      if (result.success) {
        await supabase
          .from('email_sequences')
          .update({
            email_2_sent_at: new Date().toISOString(),
            email_2_error: null,
          })
          .eq('id', seq.id);

        // Log activity
        await supabase.from('activity_log').insert({
          prospect_id: seq.prospect_id,
          action: 'email_sequence_email2_sent',
          entity_type: 'email_sequence',
          entity_id: seq.id,
          description: 'Email 2 (acceptance + Calendly) sent',
        });

        results.email2Sent++;
      } else {
        await supabase
          .from('email_sequences')
          .update({
            email_2_error: result.error,
            retry_count: seq.retry_count + 1,
            last_retry_at: new Date().toISOString(),
          })
          .eq('id', seq.id);
        results.email2Failed++;
      }
    }

    // ─── PROCESS EMAIL 3 (48h after Email 2 = 72h total) ────────
    const { data: dueEmail3 } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('status', 'active')
      .is('email_3_sent_at', null)
      .not('email_2_sent_at', 'is', null) // Only if Email 2 was sent
      .lte('email_3_scheduled_for', now)
      .lt('retry_count', EMAIL_SEQUENCE_CONFIG.MAX_RETRIES)
      .limit(50);

    for (const seq of dueEmail3 || []) {
      // Check if prospect already booked a call — skip if so
      const { data: prospect3 } = await supabase
        .from('prospects')
        .select('pipeline_status')
        .eq('id', seq.prospect_id)
        .single();

      if (prospect3?.pipeline_status === 'call_booked') {
        await supabase.from('email_sequences').update({
          status: 'completed',
          email_3_error: 'Skipped — prospect already booked a call',
        }).eq('id', seq.id);

        await supabase.from('activity_log').insert({
          prospect_id: seq.prospect_id,
          action: 'email_sequence_skipped_booked',
          entity_type: 'email_sequence',
          entity_id: seq.id,
          description: 'Email 3 skipped — prospect already booked a call',
        });
        continue;
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bb-platform-virid.vercel.app';
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${seq.unsubscribe_token}`;

      const template = getEmail3Template({
        firstName: seq.first_name || '',
        applicationType: seq.application_type as ApplicationType,
        unsubscribeUrl,
      });

      const result = await sendGmailEmail({
        to: seq.email,
        subject: template.subject,
        text: template.text,
      });

      if (result.success) {
        await supabase
          .from('email_sequences')
          .update({
            email_3_sent_at: new Date().toISOString(),
            email_3_error: null,
            status: 'completed', // Sequence done after all 3 emails
          })
          .eq('id', seq.id);

        // Log activity
        await supabase.from('activity_log').insert({
          prospect_id: seq.prospect_id,
          action: 'email_sequence_completed',
          entity_type: 'email_sequence',
          entity_id: seq.id,
          description: 'Email 3 (reminder) sent — sequence completed',
        });

        results.email3Sent++;
      } else {
        await supabase
          .from('email_sequences')
          .update({
            email_3_error: result.error,
            retry_count: seq.retry_count + 1,
            last_retry_at: new Date().toISOString(),
          })
          .eq('id', seq.id);
        results.email3Failed++;
      }
    }

    // ─── MARK FAILED SEQUENCES ──────────────────────────────────
    await supabase
      .from('email_sequences')
      .update({ status: 'failed' })
      .eq('status', 'active')
      .gte('retry_count', EMAIL_SEQUENCE_CONFIG.MAX_RETRIES);

    console.log(`[Email Cron] Results:`, results);
    return NextResponse.json({ success: true, results, timestamp: now });
  } catch (error) {
    console.error('[Email Cron] Fatal error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
