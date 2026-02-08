import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: prospectId } = await params;

    // Create Supabase client directly with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get shooting evaluation with explicit field selection (no cache)
    const { data: evaluation, error: evalError } = await supabase
      .from('shooting_evaluations')
      .select('id, prospect_id, status, player_full_name, player_level, bb_level, fourteen_spot_round_1_score, fourteen_spot_round_2_score, fourteen_spot_round_3_score, deep_distance_steps_behind, ball_flight_flat_makes, ball_flight_normal_makes, ball_flight_high_makes, fade_right_makes, fade_left_makes, back_rim_level_1_shots, back_rim_level_2_shots, back_rim_level_3_shots, miss_profile_summary, deep_distance_diagnosis, back_rim_diagnosis, ball_flight_diagnosis, written_assessment, structured_seven_day_plan, player_plan_logs')
      .eq('prospect_id', prospectId)
      .limit(1)
      .maybeSingle();

    if (evalError || !evaluation) {
      return NextResponse.json(
        { error: 'Evaluation not found', details: evalError?.message, prospectId },
        { status: 404 }
      );
    }

    // Check if evaluation has been delivered (status = 'approved')
    if (evaluation.status !== 'approved') {
      return NextResponse.json(
        { error: 'Profile not available yet', actualStatus: evaluation.status, evalId: evaluation.id },
        { status: 404 }
      );
    }

    // Get prospect info
    const { data: prospect } = await supabase
      .from('prospects')
      .select('first_name, last_name')
      .eq('id', prospectId)
      .single();

    const playerName = evaluation.player_full_name ||
      `${prospect?.first_name || ''} ${prospect?.last_name || ''}`.trim() ||
      'Player';

    // Build the profile response
    const profileData = {
      playerName,
      bbLevel: evaluation.bb_level || 1,
      playerLevel: evaluation.player_level || '',
      fourteenSpotScores: {
        round1: evaluation.fourteen_spot_round_1_score || 0,
        round2: evaluation.fourteen_spot_round_2_score || 0,
        round3: evaluation.fourteen_spot_round_3_score || 0,
        total: Math.round(
          ((evaluation.fourteen_spot_round_1_score || 0) +
            (evaluation.fourteen_spot_round_2_score || 0) +
            (evaluation.fourteen_spot_round_3_score || 0)) / 3
        ),
      },
      deepDistance: {
        line: evaluation.deep_distance_steps_behind || 0,
        makes: 0,
        attempts: 10,
      },
      ballFlight: {
        flat: evaluation.ball_flight_flat_makes || 0,
        normal: evaluation.ball_flight_normal_makes || 0,
        high: evaluation.ball_flight_high_makes || 0,
      },
      fades: {
        right: evaluation.fade_right_makes || 0,
        left: evaluation.fade_left_makes || 0,
      },
      backRim: {
        level1: evaluation.back_rim_level_1_shots || 0,
        level2: evaluation.back_rim_level_2_shots || 0,
        level3: evaluation.back_rim_level_3_shots || 0,
      },
      missProfileSummary: evaluation.miss_profile_summary || '',
      deepDistanceDiagnosis: evaluation.deep_distance_diagnosis || '',
      backRimDiagnosis: evaluation.back_rim_diagnosis || '',
      ballFlightDiagnosis: evaluation.ball_flight_diagnosis || '',
      writtenAssessment: evaluation.written_assessment || '',
      structuredSevenDayPlan: evaluation.structured_seven_day_plan || null,
      playerPlanLogs: evaluation.player_plan_logs || [],
    };

    return NextResponse.json(profileData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
