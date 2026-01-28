import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

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

    return NextResponse.json({
      success: true,
      evaluationId: evaluation.id,
    });
  } catch (error) {
    console.error('Portal submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit evaluation' },
      { status: 500 }
    );
  }
}
