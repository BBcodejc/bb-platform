import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServerSupabaseClient();

    // Get all delivered evaluations (players who received their evaluation)
    const { data: evaluations, error } = await supabase
      .from('shooting_evaluations')
      .select(`
        id,
        prospect_id,
        player_full_name,
        player_level,
        bb_level,
        status,
        structured_seven_day_plan,
        player_plan_logs,
        fourteen_spot_round_1_score,
        fourteen_spot_round_2_score,
        fourteen_spot_round_3_score,
        deep_distance_steps_behind,
        created_at,
        updated_at,
        prospects (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('status', 'approved')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching BB players:', error);
    }

    // Also fetch elite players (NBA/Pro players like Tobias Harris)
    const { data: elitePlayers, error: eliteError } = await supabase
      .from('elite_players')
      .select('*')
      .order('created_at', { ascending: false });

    if (eliteError) {
      console.error('Error fetching elite players:', eliteError);
    }

    // Process evaluations to add plan progress
    const regularPlayers = (evaluations || []).map((eval_data: any) => {
      const logs = eval_data.player_plan_logs || [];
      const completedDays = logs.filter((log: any) => log.completed).length;
      const totalDays = 7;

      // Calculate 14-spot score (average of 3 rounds)
      const r1 = eval_data.fourteen_spot_round_1_score || 0;
      const r2 = eval_data.fourteen_spot_round_2_score || 0;
      const r3 = eval_data.fourteen_spot_round_3_score || 0;
      const avg = Math.round((r1 + r2 + r3) / 3);
      const fourteenSpotScore = `${avg}/14`;

      return {
        id: eval_data.prospect_id,
        evaluationId: eval_data.id,
        name: eval_data.player_full_name ||
              `${eval_data.prospects?.first_name || ''} ${eval_data.prospects?.last_name || ''}`.trim(),
        email: eval_data.prospects?.email || '',
        phone: eval_data.prospects?.phone || '',
        level: eval_data.player_level,
        bbLevel: eval_data.bb_level || 1,
        deliveredAt: eval_data.delivered_at || eval_data.updated_at,
        planProgress: {
          completedDays,
          totalDays,
          percentage: Math.round((completedDays / totalDays) * 100),
          logs,
        },
        fourteenSpotScore,
        deepDistanceLine: eval_data.deep_distance_steps_behind || 'N/A',
        hasPlan: !!eval_data.structured_seven_day_plan,
        isElite: false,
      };
    });

    // Process elite players
    const elitePlayersList = (elitePlayers || []).map((player: any) => {
      return {
        id: player.id,
        evaluationId: null,
        name: player.name,
        email: player.email || '',
        phone: player.phone || '',
        level: 'elite',
        bbLevel: player.bb_level || 5,
        deliveredAt: player.created_at,
        planProgress: {
          completedDays: 0,
          totalDays: 7,
          percentage: 0,
          logs: [],
        },
        fourteenSpotScore: 'N/A',
        deepDistanceLine: 'N/A',
        hasPlan: false,
        isElite: true,
        slug: player.slug,
        team: player.team,
        position: player.position,
        photo_url: player.photo_url,
      };
    });

    // Combine both lists, elite players first
    const players = [...elitePlayersList, ...regularPlayers];

    return NextResponse.json({ players });
  } catch (error) {
    console.error('BB Players API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
