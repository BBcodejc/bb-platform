import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createServiceRoleClient } from '@/lib/supabase';
import { mapSeasonStatsRow } from '@/types/elite-player';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();

    // Look up player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      season,
      league,
      gamesPlayed,
      ppg,
      rpg,
      apg,
      spg,
      bpg,
      topg,
      mpg,
      fgPct,
      threePtPct,
      ftPct,
      fgMade,
      fgAttempted,
      threePtMade,
      threePtAttempted,
      ftMade,
      ftAttempted,
      midRangePct,
      paintPct,
      source,
    } = body;

    if (!season) {
      return NextResponse.json(
        { error: 'Season is required' },
        { status: 400 }
      );
    }

    const row = {
      player_id: player.id,
      season,
      league: league || 'NBA',
      games_played: gamesPlayed || 0,
      ppg: ppg || 0,
      rpg: rpg || 0,
      apg: apg || 0,
      spg: spg || 0,
      bpg: bpg || 0,
      topg: topg || 0,
      mpg: mpg || 0,
      fg_pct: fgPct || 0,
      three_pt_pct: threePtPct || 0,
      ft_pct: ftPct || 0,
      fg_made: fgMade || 0,
      fg_attempted: fgAttempted || 0,
      three_pt_made: threePtMade || 0,
      three_pt_attempted: threePtAttempted || 0,
      ft_made: ftMade || 0,
      ft_attempted: ftAttempted || 0,
      mid_range_pct: midRangePct ?? null,
      paint_pct: paintPct ?? null,
      source: source || 'manual',
      last_synced_at: new Date().toISOString(),
    };

    // Upsert on (player_id, season)
    const { data, error } = await supabase
      .from('elite_season_stats')
      .upsert(row, { onConflict: 'player_id,season' })
      .select()
      .single();

    if (error) {
      console.error('Season stats upsert error:', error);
      return NextResponse.json(
        { error: 'Failed to save season stats' },
        { status: 500 }
      );
    }

    return NextResponse.json(mapSeasonStatsRow(data), { status: 200 });
  } catch (error) {
    console.error('Season stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
