import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

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
  const subject = `New Coach Certification Application - ${data.firstName} ${data.lastName}`;
  const html = `
    <h2>New Coach Certification Application</h2>
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <p><strong>Location:</strong> ${data.location || 'Not provided'}</p>
    <hr />
    <p><strong>Coaching Role:</strong> ${data.coachingRole || 'Not provided'}</p>
    <p><strong>Years Coaching:</strong> ${data.yearsCoaching || 'Not provided'}</p>
    <p><strong>Works With:</strong> ${data.playerLevelWorkWith || 'Not provided'}</p>
    <hr />
    <p><strong>Why Interested:</strong></p>
    <p>${data.whyInterested || 'Not provided'}</p>
    <p><strong>Current Training Style:</strong></p>
    <p>${data.currentTrainingStyle || 'Not provided'}</p>
    <hr />
    <p><strong>Open to Investment:</strong> ${data.investmentInterest || 'Not provided'}</p>
    <hr />
    <p style="color: #888; font-size: 12px;">Submitted at ${new Date().toISOString()}</p>
  `;
  return { subject, html };
}

function formatOrgInquiryEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const subject = `New Organization Inquiry - ${data.orgName}`;
  const html = `
    <h2>New Team/Organization Inquiry</h2>
    <p><strong>Contact Name:</strong> ${data.contactName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <hr />
    <p><strong>Organization:</strong> ${data.orgName}</p>
    <p><strong>Type:</strong> ${data.orgType || 'Not provided'}</p>
    <p><strong>Player Count:</strong> ${data.playerCount || 'Not provided'}</p>
    <hr />
    <p><strong>Current Challenge:</strong></p>
    <p>${data.currentChallenge || 'Not provided'}</p>
    <p><strong>Ideal Outcome:</strong></p>
    <p>${data.idealOutcome || 'Not provided'}</p>
    <hr />
    <p><strong>Support Needed:</strong> ${data.supportNeeded || 'Not provided'}</p>
    <p><strong>Timeline:</strong> ${data.timeline || 'Not provided'}</p>
    <hr />
    <p><strong>Additional Info:</strong></p>
    <p>${data.additionalInfo || 'Not provided'}</p>
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

    const supabase = createServerSupabaseClient();

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
      const contactName = (formData.contactName as string) || '';
      const nameParts = contactName.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
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
        coaching_level: formData.coachingRole || null,
        player_location: formData.location || null,
        notes: `Application Type: ${type}\nYears Coaching: ${formData.yearsCoaching || 'N/A'}\nWorks With: ${formData.playerLevelWorkWith || 'N/A'}\nWhy Interested: ${formData.whyInterested || 'N/A'}\nCurrent Training Style: ${formData.currentTrainingStyle || 'N/A'}`,
      });
    } else if (type === 'organization_inquiry') {
      Object.assign(prospectData, {
        org_name: formData.orgName || null,
        notes: `Application Type: ${type}\nOrg Type: ${formData.orgType || 'N/A'}\nPlayer Count: ${formData.playerCount || 'N/A'}\nChallenge: ${formData.currentChallenge || 'N/A'}\nIdeal Outcome: ${formData.idealOutcome || 'N/A'}\nSupport Needed: ${formData.supportNeeded || 'N/A'}\nTimeline: ${formData.timeline || 'N/A'}`,
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
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
