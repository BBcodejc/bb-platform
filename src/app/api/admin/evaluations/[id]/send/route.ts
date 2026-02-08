import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

const FROM_EMAIL = 'Jake from BB <jake@trainwjc.com>';
const REPLY_TO_EMAIL = 'bbcodejc@gmail.com';

async function sendEmail(to: string, subject: string, html: string) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log('========== EMAIL (NO API KEY) ==========');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('=========================================');
    return { success: false, error: 'No Resend API key' };
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
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

function formatProtocol(value: string): string {
  const protocols: Record<string, string> = {
    'deep_distance': 'Deep Distance Protocol',
    'back_rim_calibration': 'Back-Rim Calibration',
    'ball_flight_spectrum': 'Ball Flight Spectrum (25°/45°/60°)',
    'oversized_ball': 'Oversized Ball Gauntlet',
    'strobe_calibration': 'Strobe Calibration',
    'speed_release': 'Speed Release Protocol',
    'constraint_integration': 'Constraint Integration',
  };
  return protocols[value] || value.replace(/_/g, ' ');
}

function formatLimitingFactor(value: string): string {
  const factors: Record<string, string> = {
    'horizontal_distance_control': 'Horizontal Distance Control',
    'two_motion_pause': 'Two-Motion / Pause Pattern',
    'internal_cueing': 'Internal Cueing / Top-Down Control',
  };
  return factors[value] || value.replace(/_/g, ' ');
}

interface DayPlan {
  warmup: string;
  mainWork: string;
  finish: string;
}

interface SevenDayPlan {
  day1: DayPlan;
  day2: DayPlan;
  day3: DayPlan;
  day4: DayPlan;
  day5: DayPlan;
  day6: DayPlan;
  day7: DayPlan;
}

function getBBLevelDescription(level: number): string {
  const levels: Record<number, string> = {
    0: 'Unranked',
    1: 'Level 1 - Foundation (Energy Awareness)',
    2: 'Level 2 - Calibrated (Impulse & Precision)',
    3: 'Level 3 - Adaptive (Constraint Integration)',
    4: 'Level 4 - Master (Reflexive Dominance)',
  };
  return levels[level] || `Level ${level}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: prospectId } = await params;
    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Get shooting evaluation data
    const { data: shootingEval, error: shootingError } = await supabase
      .from('shooting_evaluations')
      .select('*')
      .eq('prospect_id', prospectId)
      .single();

    if (shootingError || !shootingEval) {
      return NextResponse.json(
        { success: false, error: 'Shooting evaluation not found' },
        { status: 404 }
      );
    }

    // Get prospect data
    const { data: prospect, error: prospectError } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single();

    if (prospectError || !prospect) {
      return NextResponse.json(
        { success: false, error: 'Prospect not found' },
        { status: 404 }
      );
    }

    // Update shooting evaluation status to approved (delivered) and save all assessment data
    const updateData: Record<string, any> = {
      status: 'approved',
      bb_level: body.currentBBLevel || 1,
      primary_miss: body.missProfilePrimary || null,
      secondary_miss: body.missProfileSecondary || null,
      miss_profile_summary: body.missProfileSummary || null,
      deep_distance_diagnosis: body.deepDistanceDiagnosis || null,
      back_rim_diagnosis: body.backRimDiagnosis || null,
      ball_flight_diagnosis: body.ballFlightDiagnosis || null,
      written_assessment: body.fullAssessment || null,
      shooting_limiting_factors: body.shootingLimitingFactors || [],
      selected_protocols: body.priorityProtocols || [],
      seven_day_plan: body.sevenDayPlan || null,
      structured_seven_day_plan: body.structuredSevenDayPlan || null,
      is_high_ticket_prospect: body.highTicketProspect || false,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('shooting_evaluations')
      .update(updateData)
      .eq('id', shootingEval.id);

    if (updateError) {
      console.error('Failed to update shooting evaluation:', updateError);
      // Don't fail the whole request, but log it
    }

    // Update prospect pipeline status
    await supabase
      .from('prospects')
      .update({
        pipeline_status: 'profile_delivered',
        high_ticket_prospect: body.highTicketProspect || prospect.high_ticket_prospect,
      })
      .eq('id', prospectId);

    // Calculate stats for email
    const r1 = shootingEval.fourteen_spot_round_1_score || 0;
    const r2 = shootingEval.fourteen_spot_round_2_score || 0;
    const r3 = shootingEval.fourteen_spot_round_3_score || 0;
    const avg = ((r1 + r2 + r3) / 3).toFixed(1);

    const playerName = shootingEval.player_full_name ||
      `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim() ||
      'Player';
    const firstName = playerName.split(' ')[0];

    // Build 7-day plan HTML
    const sevenDayPlan = body.sevenDayPlan as SevenDayPlan | undefined;
    const sevenDayPlanHtml = sevenDayPlan ? `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        ${(['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'] as const).map((day, i) => {
          const plan = sevenDayPlan[day];
          const isRestDay = plan.mainWork.toLowerCase().includes('off day') || plan.mainWork.toLowerCase().includes('rhythm');
          return `
            <tr style="background: ${isRestDay ? '#f0f9f0' : '#faf8f3'}; border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 12px; font-weight: 600; color: #d4af37; width: 60px;">Day ${i + 1}</td>
              <td style="padding: 12px;">
                <div style="font-size: 13px; color: #666; margin-bottom: 4px;">${plan.warmup}</div>
                <div style="font-weight: 500; color: #1a1a1a;">${plan.mainWork}</div>
                <div style="font-size: 13px; color: #666; margin-top: 4px;">${plan.finish}</div>
              </td>
            </tr>
          `;
        }).join('')}
      </table>
    ` : '';

    // Build limiting factors HTML
    const limitingFactorsHtml = (body.shootingLimitingFactors || []).length > 0
      ? `<ul style="margin: 10px 0; padding-left: 20px;">
          ${(body.shootingLimitingFactors as string[]).map(f => `<li style="margin: 5px 0;">${formatLimitingFactor(f)}</li>`).join('')}
        </ul>`
      : '';

    // Send email to player
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
    .content { background: #ffffff; padding: 40px 30px; }
    .section { margin-bottom: 30px; }
    .section-title { color: #d4af37; font-size: 18px; font-weight: 600; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #f0e6cc; }
    .stats-grid { display: table; width: 100%; margin: 15px 0; }
    .stat-box { display: table-cell; text-align: center; padding: 15px; background: #faf8f3; border: 1px solid #f0e6cc; }
    .stat-value { font-size: 32px; font-weight: 700; color: #1a1a1a; }
    .stat-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 5px; }
    .level-box { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #ffffff; padding: 25px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .level-box h3 { color: #d4af37; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .level-box p { margin: 0; font-size: 20px; font-weight: 600; }
    .assessment-box { background: #faf8f3; padding: 25px; border-radius: 8px; border-left: 4px solid #d4af37; margin: 20px 0; }
    .protocol-item { background: #f5f5f5; padding: 12px 15px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #d4af37; }
    .cta-button { display: inline-block; background: #d4af37; color: #1a1a1a !important; padding: 15px 35px; text-decoration: none; font-weight: 600; border-radius: 6px; margin: 20px 0; }
    .footer { background: #1a1a1a; color: #888; padding: 30px; text-align: center; font-size: 14px; }
    .footer a { color: #d4af37; text-decoration: none; }
    .miss-tag { display: inline-block; background: #fff3cd; color: #856404; padding: 4px 12px; border-radius: 4px; font-size: 13px; margin: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BASKETBALL BIOMECHANICS</h1>
      <p>Your BB Evaluation is Ready</p>
    </div>

    <div class="content">
      <p style="font-size: 18px;">Hey ${firstName}!</p>
      <p>Your personalized BB Shooting Evaluation has been reviewed and your profile is ready. Here's a complete breakdown of your assessment:</p>

      <div class="section">
        <h2 class="section-title">14-Spot Baseline Results</h2>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value">${r1}</div>
            <div class="stat-label">Round 1</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${r2}</div>
            <div class="stat-label">Round 2</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${r3}</div>
            <div class="stat-label">Round 3</div>
          </div>
        </div>
        <div class="level-box">
          <h3>Your Average</h3>
          <p>${avg} / 14</p>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Your BB Level</h2>
        <div class="level-box">
          <h3>Current Level</h3>
          <p>${getBBLevelDescription(body.currentBBLevel)}</p>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Miss Profile</h2>
        <p>Your primary miss tendency:</p>
        <span class="miss-tag">${body.missProfilePrimary ? body.missProfilePrimary.charAt(0).toUpperCase() + body.missProfilePrimary.slice(1) : 'N/A'}</span>
        ${body.missProfileSecondary ? `<span class="miss-tag">${body.missProfileSecondary.charAt(0).toUpperCase() + body.missProfileSecondary.slice(1)}</span>` : ''}
      </div>

      ${body.shootingLimitingFactors && body.shootingLimitingFactors.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Key Limiting Factors</h2>
        <p>Areas to focus on based on your evaluation:</p>
        ${limitingFactorsHtml}
      </div>
      ` : ''}

      ${body.priorityProtocols && body.priorityProtocols.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Your Priority Protocols</h2>
        <p>Focus on these to see the fastest improvement:</p>
        ${(body.priorityProtocols as string[]).map(p => `<div class="protocol-item">${formatProtocol(p)}</div>`).join('')}
      </div>
      ` : ''}

      ${sevenDayPlan ? `
      <div class="section">
        <h2 class="section-title">Your 7-Day Plan</h2>
        <p>Follow this plan for the next week, then retest to see your progress:</p>
        ${sevenDayPlanHtml}
      </div>
      ` : ''}

      ${body.fullAssessment ? `
      <div class="section">
        <h2 class="section-title">Full Assessment</h2>
        <div class="assessment-box">
          <p style="margin: 0; white-space: pre-line;">${body.fullAssessment}</p>
        </div>
      </div>
      ` : ''}

      ${body.structuredSevenDayPlan?.playerPlanLogEnabled ? `
      <div class="section" style="text-align: center; margin-top: 30px;">
        <a href="https://bb-platform-virid.vercel.app/portal/${prospectId}/plan" class="cta-button" style="display: inline-block; background: #d4af37; color: #1a1a1a !important; padding: 15px 35px; text-decoration: none; font-weight: 600; border-radius: 6px;">
          View & Track Your 7-Day Plan →
        </a>
        <p style="margin-top: 10px; font-size: 13px; color: #666;">Log your workouts, track progress, and see detailed instructions</p>
      </div>
      ` : ''}

      <div class="section" style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #f0e6cc;">
        <h2 class="section-title" style="border: none;">What's Next?</h2>
        <p>Run your 7-day plan, then retest. Read the miss → get the ball back to the target. That's the skill.</p>
        ${body.highTicketProspect ? `
        <p style="margin-top: 20px;"><strong>Want to accelerate your progress?</strong></p>
        <p>Based on your evaluation, you'd be a great fit for the 3-month mentorship with strobes + oversized ball training. Reply to this email to learn more.</p>
        ` : `
        <p>Have questions about your assessment? Just reply to this email.</p>
        `}
      </div>

      <p style="margin-top: 40px;">Let's get to work.</p>
      <p style="color: #d4af37; font-weight: bold; font-size: 16px;">— Coach Jake</p>
    </div>

    <div class="footer">
      <p><strong>Basketball Biomechanics</strong></p>
      <p>Questions? Reply to this email or reach out at <a href="mailto:bbcodejc@gmail.com">bbcodejc@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
`;

    // Send the email
    const playerEmail = prospect.email;
    if (playerEmail) {
      const emailResult = await sendEmail(
        playerEmail,
        'Your BB Evaluation is Ready',
        emailHtml
      );

      if (!emailResult.success) {
        console.error('Failed to send evaluation email:', emailResult.error);
      }
    }

    // Also send notification to admin
    await sendEmail(
      'bbcodejc@gmail.com',
      `Evaluation Sent - ${playerName}`,
      `
        <h2>Evaluation Delivered</h2>
        <p><strong>Player:</strong> ${playerName}</p>
        <p><strong>Email:</strong> ${playerEmail}</p>
        <p><strong>BB Level:</strong> ${getBBLevelDescription(body.currentBBLevel)}</p>
        <p><strong>14-Spot Average:</strong> ${avg}/14</p>
        <p><strong>High-Ticket Prospect:</strong> ${body.highTicketProspect ? 'Yes' : 'No'}</p>
        <hr />
        <p><a href="https://bb-platform-virid.vercel.app/admin/evaluations/${prospectId}">View Evaluation →</a></p>
      `
    );

    return NextResponse.json({
      success: true,
      evaluationId: shootingEval.id,
      emailSent: !!playerEmail,
    });
  } catch (error: any) {
    console.error('Send evaluation error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send evaluation' },
      { status: 500 }
    );
  }
}
