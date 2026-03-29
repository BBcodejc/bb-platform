import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { sendGmailEmail } from '@/lib/gmail';
import { getEmail1Template, EMAIL_SEQUENCE_CONFIG } from '@/lib/email-templates';
import type { ApplicationType } from '@/lib/email-templates';

const NOTIFICATION_EMAIL = 'bbcodejc@gmail.com';
const FROM_EMAIL = 'Jake from BB <jake@trainwjc.com>';

interface ApplicationData {
  type: 'full_assessment_application' | 'coach_cert_application' | 'organization_inquiry';
  [key: string]: unknown;
}

// Send email notification using Resend (or fallback to console log if not configured)
async function sendEmailNotification(subject: string, html: string) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log('========== EMAIL NOTIFICATION ==========');
    console.log('To:', NOTIFICATION_EMAIL);
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
        to: NOTIFICATION_EMAIL,
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

function formatFullAssessmentEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const subject = `New BB Full Assessment Application - ${data.firstName} ${data.lastName}`;
  const html = `
    <h2>New Full Assessment Application</h2>
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <hr />
    <p><strong>Age:</strong> ${data.age || 'Not provided'}</p>
    <p><strong>Level:</strong> ${data.level || 'Not provided'}</p>
    <p><strong>Position:</strong> ${data.position || 'Not provided'}</p>
    <hr />
    <p><strong>Current Situation:</strong></p>
    <p>${data.currentSituation || 'Not provided'}</p>
    <p><strong>Biggest Problems:</strong></p>
    <p>${data.biggestProblems || 'Not provided'}</p>
    <p><strong>What They've Tried:</strong></p>
    <p>${data.whatTried || 'Not provided'}</p>
    <hr />
    <p><strong>Commitment Level:</strong> ${data.commitmentLevel || 'Not provided'}</p>
    <hr />
    <p style="color: #888; font-size: 12px;">Submitted at ${new Date().toISOString()}</p>
  `;
  return { subject, html };
}

function formatCoachCertEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const subject = `New Coach Inquiry - ${data.firstName} ${data.lastName}`;
  const html = `
    <h2>New Coach Inquiry</h2>
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <hr />
    <p><strong>Coaching Level:</strong> ${data.coachRole || data.coachingRole || 'Not provided'}</p>
    <p><strong>Years Coaching:</strong> ${data.yearsCoaching || 'Not provided'}</p>
    <hr />
    <p><strong>What They're Looking to Learn/Solve:</strong></p>
    <p>${data.whyInterested || 'Not provided'}</p>
    <hr />
    <p><strong>How They Heard About BB:</strong> ${data.howHeard || 'Not provided'}</p>
    <hr />
    <p style="color: #888; font-size: 12px;">Submitted at ${new Date().toISOString()}</p>
  `;
  return { subject, html };
}

function formatOrgInquiryEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const contactName = data.contactName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Not provided';
  const subject = `New Organization Inquiry - ${data.orgName}`;
  const html = `
    <h2>New Team/Organization Inquiry</h2>
    <p><strong>Contact Name:</strong> ${contactName}</p>
    <p><strong>Role/Title:</strong> ${data.role || 'Not provided'}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <hr />
    <p><strong>Organization:</strong> ${data.orgName}</p>
    <p><strong>Level:</strong> ${data.orgType || 'Not provided'}</p>
    <p><strong>Roster Size:</strong> ${data.playerCount || 'Not provided'}</p>
    <hr />
    <p><strong>What They're Looking to Address:</strong></p>
    <p>${data.currentChallenge || 'Not provided'}</p>
    <hr />
    <p><strong>How They Heard About BB:</strong> ${data.howHeard || 'Not provided'}</p>
    <hr />
    <p style="color: #888; font-size: 12px;">Submitted at ${new Date().toISOString()}</p>
  `;
  return { subject, html };
}

export async function POST(request: NextRequest) {
  try {
    const body: ApplicationData = await request.json();
    const { type, ...formData } = body;

    if (!type || !['full_assessment_application', 'coach_cert_application', 'organization_inquiry'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application type' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Determine role and email based on type
    let role: string;
    let email: string;
    let firstName: string;
    let lastName: string;

    if (type === 'full_assessment_application') {
      role = 'player';
      email = formData.email as string;
      firstName = formData.firstName as string;
      lastName = formData.lastName as string;
    } else if (type === 'coach_cert_application') {
      role = 'coach';
      email = formData.email as string;
      firstName = formData.firstName as string;
      lastName = formData.lastName as string;
    } else {
      role = 'organization';
      email = formData.email as string;
      // Form sends firstName/lastName directly (split from contactName on client)
      firstName = (formData.firstName as string) || '';
      lastName = (formData.lastName as string) || '';
      // Fallback: if contactName was sent directly (e.g. from a different form)
      if (!firstName && formData.contactName) {
        const contactName = formData.contactName as string;
        const nameParts = contactName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
    }

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Build prospect data
    const prospectData: Record<string, unknown> = {
      role,
      email,
      first_name: firstName,
      last_name: lastName,
      phone: formData.phone || null,
      pipeline_status: 'new',
      high_ticket_prospect: type === 'organization_inquiry' || type === 'full_assessment_application',
      notes: `Application Type: ${type}`,
    };

    // Add type-specific fields
    if (type === 'full_assessment_application') {
      Object.assign(prospectData, {
        player_age: formData.playerAge || formData.age || null,
        player_level: formData.playerLevel || formData.level || null,
        goals: formData.biggestProblems || formData.currentSituation || null,
        commitment_level: formData.commitmentLevel || null,
        notes: `Application Type: ${type}\nPosition: ${formData.position || 'N/A'}\nCurrent Situation: ${formData.currentSituation || 'N/A'}\nBiggest Problems: ${formData.biggestProblems || 'N/A'}\nWhat Tried: ${formData.whatTried || 'N/A'}`,
      });
    } else if (type === 'coach_cert_application') {
      Object.assign(prospectData, {
        notes: `Application Type: ${type}\nCoaching Level: ${formData.coachRole || 'N/A'}\nYears Coaching: ${formData.yearsCoaching || 'N/A'}\nLooking to Learn/Solve: ${formData.whyInterested || 'N/A'}\nHow Heard: ${formData.howHeard || 'N/A'}`,
      });
    } else if (type === 'organization_inquiry') {
      Object.assign(prospectData, {
        org_name: formData.orgName || null,
        org_player_count: formData.playerCount || null,
        org_goals: formData.currentChallenge || null,
        notes: `Application Type: ${type}\nRole/Title: ${formData.role || 'N/A'}\nOrg Level: ${formData.orgType || 'N/A'}\nRoster Size: ${formData.playerCount || 'N/A'}\nLooking to Address: ${formData.currentChallenge || 'N/A'}\nHow Heard: ${formData.howHeard || 'N/A'}`,
      });
    }

    // Check if prospect already exists
    const { data: existingProspect } = await supabase
      .from('prospects')
      .select('id')
      .eq('email', email)
      .single();

    let prospect;

    if (existingProspect) {
      // Update existing prospect
      const { data, error } = await supabase
        .from('prospects')
        .update(prospectData)
        .eq('id', existingProspect.id)
        .select()
        .single();

      if (error) throw error;
      prospect = data;
    } else {
      // Create new prospect
      const { data, error } = await supabase
        .from('prospects')
        .insert(prospectData)
        .select()
        .single();

      if (error) throw error;
      prospect = data;
    }

    // Send email notification
    let emailContent: { subject: string; html: string };

    if (type === 'full_assessment_application') {
      emailContent = formatFullAssessmentEmail(formData);
    } else if (type === 'coach_cert_application') {
      emailContent = formatCoachCertEmail(formData);
    } else {
      emailContent = formatOrgInquiryEmail(formData);
    }

    await sendEmailNotification(emailContent.subject, emailContent.html);

    // ─── EMAIL SEQUENCE: Send Email 1 + schedule follow-ups ─────
    try {
      // Duplicate prevention: only create sequence if none exists for this email
      const { data: existingSequence } = await supabase
        .from('email_sequences')
        .select('id')
        .eq('email', email)
        .in('status', ['active', 'completed'])
        .single();

      if (!existingSequence) {
        const now = new Date();
        const email2At = new Date(now.getTime() + EMAIL_SEQUENCE_CONFIG.EMAIL_2_DELAY_HOURS * 60 * 60 * 1000);
        const email3At = new Date(email2At.getTime() + EMAIL_SEQUENCE_CONFIG.EMAIL_3_DELAY_HOURS * 60 * 60 * 1000);

        // Create sequence record (generates unsubscribe_token automatically via DB default)
        const { data: sequence, error: seqError } = await supabase
          .from('email_sequences')
          .insert({
            prospect_id: prospect.id,
            email,
            first_name: firstName,
            application_type: type,
            status: 'active',
            email_2_scheduled_for: email2At.toISOString(),
            email_3_scheduled_for: email3At.toISOString(),
          })
          .select()
          .single();

        if (seqError) {
          console.error('[Email Sequence] Failed to create sequence:', seqError);
        } else {
          // Send Email 1 immediately
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bb-platform-virid.vercel.app';
          const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${sequence.unsubscribe_token}`;

          const email1 = getEmail1Template({
            firstName,
            applicationType: type as ApplicationType,
            unsubscribeUrl,
          });

          const sendResult = await sendGmailEmail({
            to: email,
            subject: email1.subject,
            text: email1.text,
          });

          // Update sequence with Email 1 result
          await supabase
            .from('email_sequences')
            .update({
              email_1_sent_at: sendResult.success ? new Date().toISOString() : null,
              email_1_error: sendResult.error || null,
            })
            .eq('id', sequence.id);

          console.log(`[Email Sequence] Email 1 ${sendResult.success ? 'sent' : 'failed'} to ${email}`);
        }
      } else {
        console.log(`[Email Sequence] Skipped — active sequence already exists for ${email}`);
      }
    } catch (seqError) {
      console.error('[Email Sequence] Error (non-blocking):', seqError);
      // Never fail the main form submission due to email sequence issues
    }
    // ─── END EMAIL SEQUENCE ─────────────────────────────────────

    // Log activity
    try {
      await supabase.from('activity_log').insert({
        prospect_id: prospect.id,
        action: 'application_submitted',
        entity_type: 'prospect',
        entity_id: prospect.id,
        description: `${type} submitted`,
        new_value: { type, timestamp: new Date().toISOString() },
      });
    } catch (logError) {
      console.error('Activity log error:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      prospectId: prospect.id,
    });
  } catch (error) {
    console.error('Application error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to submit application', details: errorMessage },
      { status: 500 }
    );
  }
}
