import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

const NOTIFICATION_EMAIL = 'bbcodejc@gmail.com';
const FROM_EMAIL = 'Jake from BB <jake@trainwjc.com>';
const REPLY_TO_EMAIL = 'bbcodejc@gmail.com';

async function sendEmailNotification(subject: string, html: string, toEmail?: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = toEmail || NOTIFICATION_EMAIL;

  if (!resendApiKey) {
    console.log('========== EMAIL NOTIFICATION ==========');
    console.log('To:', recipient);
    console.log('Subject:', subject);
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: prospectId } = await params;
    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Transform the evaluation data for database storage
    const evaluationData = {
      prospect_id: prospectId,
      submission_timestamp: body.submission_timestamp || new Date().toISOString(),
      status: 'pending_review',

      // Player Info
      player_full_name: body.player_info?.full_name,
      player_age: body.player_info?.age,
      player_level: body.player_info?.level,
      player_position: body.player_info?.primary_position,
      player_dominant_hand: body.player_info?.dominant_hand,

      // 14-Spot Baseline
      fourteen_spot_round_1_score: body.fourteen_spot?.round_1?.score,
      fourteen_spot_round_1_miss_profile: body.fourteen_spot?.round_1?.miss_profile,
      fourteen_spot_round_2_score: body.fourteen_spot?.round_2?.score,
      fourteen_spot_round_2_miss_profile: body.fourteen_spot?.round_2?.miss_profile,
      fourteen_spot_round_3_score: body.fourteen_spot?.round_3?.score,
      fourteen_spot_round_3_miss_profile: body.fourteen_spot?.round_3?.miss_profile,
      fourteen_spot_video_url: body.fourteen_spot?.video_url,

      // Deep Distance
      deep_distance_steps_behind: body.deep_distance?.deep_distance_steps_behind_line,
      deep_distance_rim_hits: body.deep_distance?.deep_line_rim_hits_10,
      deep_distance_total_shots: body.deep_distance?.deep_line_total_shots_10,
      contrast_steps_forward: body.deep_distance?.contrast_steps_forward,
      contrast_rim_hits: body.deep_distance?.contrast_rim_hits_10,
      contrast_total_shots: body.deep_distance?.contrast_total_shots_10,
      deep_distance_video_url: body.deep_distance?.video_url,

      // Back-Rim Challenge
      back_rim_level_1_shots: body.back_rim?.level_1?.total_shots,
      back_rim_level_1_time: body.back_rim?.level_1?.time_seconds,
      back_rim_level_2_shots: body.back_rim?.level_2?.total_shots,
      back_rim_level_2_time: body.back_rim?.level_2?.time_seconds,
      back_rim_level_3_shots: body.back_rim?.level_3?.total_shots,
      back_rim_level_3_time: body.back_rim?.level_3?.time_seconds,
      back_rim_video_url: body.back_rim?.video_url,

      // Ball Flight Spectrum
      ball_flight_flat_makes: body.ball_flight?.flat?.makes_or_backrim_7,
      ball_flight_flat_miss_profile: body.ball_flight?.flat?.miss_profile,
      ball_flight_normal_makes: body.ball_flight?.normal?.makes_or_backrim_7,
      ball_flight_normal_miss_profile: body.ball_flight?.normal?.miss_profile,
      ball_flight_high_makes: body.ball_flight?.high?.makes_or_backrim_7,
      ball_flight_high_miss_profile: body.ball_flight?.high?.miss_profile,
      ball_flight_video_url: body.ball_flight?.video_url,

      // Fades
      fade_right_makes: body.fades?.fade_right?.makes_or_backrim_7,
      fade_right_miss_profile: body.fades?.fade_right?.miss_profile,
      fade_left_makes: body.fades?.fade_left?.makes_or_backrim_7,
      fade_left_miss_profile: body.fades?.fade_left?.miss_profile,
      fades_video_url: body.fades?.video_url,

      // Final Notes
      additional_notes: body.final_notes?.anything_else,
    };

    // Check if evaluation already exists for this prospect
    const { data: existingEval } = await supabase
      .from('shooting_evaluations')
      .select('id')
      .eq('prospect_id', prospectId)
      .single();

    let evaluation;

    if (existingEval) {
      // Update existing evaluation
      const { data, error } = await supabase
        .from('shooting_evaluations')
        .update(evaluationData)
        .eq('id', existingEval.id)
        .select()
        .single();

      if (error) throw error;
      evaluation = data;
    } else {
      // Create new evaluation
      const { data, error } = await supabase
        .from('shooting_evaluations')
        .insert(evaluationData)
        .select()
        .single();

      if (error) throw error;
      evaluation = data;
    }

    // Update prospect pipeline status
    await supabase
      .from('prospects')
      .update({ pipeline_status: 'evaluation_submitted' })
      .eq('id', prospectId);

    // Get prospect details for email
    const { data: prospect } = await supabase
      .from('prospects')
      .select('first_name, last_name, email')
      .eq('id', prospectId)
      .single();

    // Calculate 14-spot average
    const r1 = body.fourteen_spot?.round_1?.score || 0;
    const r2 = body.fourteen_spot?.round_2?.score || 0;
    const r3 = body.fourteen_spot?.round_3?.score || 0;
    const avg = ((r1 + r2 + r3) / 3).toFixed(1);

    // Send admin notification
    await sendEmailNotification(
      `New Evaluation Submitted - ${body.player_info?.full_name || prospect?.first_name || 'Unknown'}`,
      `
        <h2>New BB Shooting Evaluation Submitted</h2>
        <p><strong>Player:</strong> ${body.player_info?.full_name || 'N/A'}</p>
        <p><strong>Email:</strong> ${prospect?.email || 'N/A'}</p>
        <p><strong>Level:</strong> ${body.player_info?.level || 'N/A'}</p>
        <p><strong>Age:</strong> ${body.player_info?.age || 'N/A'}</p>
        <hr />
        <h3>14-Spot Baseline Results</h3>
        <p>Round 1: ${r1}/14 | Round 2: ${r2}/14 | Round 3: ${r3}/14</p>
        <p><strong>Average: ${avg}/14</strong></p>
        <hr />
        <h3>Deep Distance</h3>
        <p>Steps behind 3PT line: ${body.deep_distance?.deep_distance_steps_behind_line ?? 'N/A'}</p>
        <hr />
        <h3>Back-Rim Challenge</h3>
        <p>Level 1 shots: ${body.back_rim?.level_1?.total_shots ?? 'N/A'}</p>
        <p>Level 2 shots: ${body.back_rim?.level_2?.total_shots ?? 'N/A'}</p>
        <p>Level 3 shots: ${body.back_rim?.level_3?.total_shots ?? 'N/A'}</p>
        <hr />
        <p><a href="https://bb-platform-virid.vercel.app/admin/evaluations/${prospectId}">View Full Evaluation →</a></p>
        <p style="color: #888; font-size: 12px;">Evaluation ID: ${evaluation.id}</p>
      `
    );

    // Send confirmation to player
    if (prospect?.email) {
      await sendEmailNotification(
        'BB Evaluation Received - We\'re On It!',
        `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: #d4af37; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .results-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #d4af37; }
    .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">BASKETBALL BIOMECHANICS</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Evaluation Received</p>
    </div>

    <div class="content">
      <h2 style="color: #1a1a1a;">Hey ${body.player_info?.full_name?.split(' ')[0] || prospect?.first_name || 'there'}!</h2>
      <p>Your BB Shooting Evaluation has been received. Here's a quick summary of what you submitted:</p>

      <div class="results-box">
        <h3 style="margin-top: 0; color: #d4af37;">14-Spot Baseline</h3>
        <p>Round 1: ${r1}/14 | Round 2: ${r2}/14 | Round 3: ${r3}/14</p>
        <p style="font-size: 18px;"><strong>Average: ${avg}/14</strong></p>
      </div>

      <div class="results-box">
        <h3 style="margin-top: 0; color: #d4af37;">Deep Distance</h3>
        <p>${body.deep_distance?.deep_distance_steps_behind_line ?? '?'} steps behind the 3PT line</p>
      </div>

      <div class="highlight">
        <strong>What's next?</strong> We're reviewing your evaluation and videos now. You'll receive your personalized BB Profile within 5 business days.
      </div>

      <p>If you have any questions or need to update your submission, just reply to this email.</p>

      <p style="margin-top: 30px;">Talk soon.</p>
      <p style="color: #d4af37; font-weight: bold;">— Coach Jake & the BB Team</p>
    </div>

    <div class="footer">
      <p>Basketball Biomechanics</p>
    </div>
  </div>
</body>
</html>
        `,
        prospect.email
      );
    }

    return NextResponse.json({
      success: true,
      evaluationId: evaluation.id,
    });
  } catch (error: any) {
    console.error('Portal submit error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to submit evaluation',
        details: error?.details || error?.hint || null
      },
      { status: 500 }
    );
  }
}
