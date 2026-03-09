import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createServiceRoleClient } from '@/lib/supabase';
import { mapSeasonStatsRow } from '@/types/elite-player';

export const dynamic = 'force-dynamic';

interface BallDontLiePlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  team: {
    id: number;
    abbreviation: string;
    full_name: string;
  };
}

interface BallDontLieSeasonAvg {
  player_id: number;
  season: number;
  games_played: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  min: string;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
}

interface BallDontLieGameStat {
  id: number;
  game: {
    id: number;
    date: string;
    home_team_id: number;
    visitor_team_id: number;
    home_team_score: number;
    visitor_team_score: number;
  };
  player: { id: number };
  team: { id: number; abbreviation: string };
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  min: string;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
}

async function fetchFromBallDontLie(endpoint: string, apiKey: string) {
  const response = await fetch(`https://api.balldontlie.io/v1${endpoint}`, {
    headers: {
      Authorization: apiKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`BallDontLie API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const apiKey = process.env.BALLDONTLIE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NBA API key not configured' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Fetch player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('*')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    let nbaPlayerId = player.nba_player_id;

    // If no nba_player_id, search for it
    if (!nbaPlayerId) {
      const searchQuery = `${player.first_name} ${player.last_name}`;
      const searchResult = await fetchFromBallDontLie(
        `/players?search=${encodeURIComponent(searchQuery)}`,
        apiKey
      );

      if (!searchResult.data || searchResult.data.length === 0) {
        return NextResponse.json(
          { error: `No NBA player found for "${searchQuery}"` },
          { status: 404 }
        );
      }

      const foundPlayer: BallDontLiePlayer = searchResult.data[0];
      nbaPlayerId = foundPlayer.id;

      // Store nba_player_id on elite_players for future syncs
      await supabase
        .from('elite_players')
        .update({ nba_player_id: nbaPlayerId })
        .eq('id', player.id);
    }

    // Fetch season averages and recent games in parallel
    const [seasonAvgResult, recentGamesResult] = await Promise.all([
      fetchFromBallDontLie(
        `/season_averages?season=2025&player_ids[]=${nbaPlayerId}`,
        apiKey
      ),
      fetchFromBallDontLie(
        `/stats?seasons[]=2025&player_ids[]=${nbaPlayerId}&per_page=10`,
        apiKey
      ),
    ]);

    const seasonAvg: BallDontLieSeasonAvg | undefined = seasonAvgResult.data?.[0];

    if (!seasonAvg) {
      return NextResponse.json(
        { error: 'No season averages found for this player' },
        { status: 404 }
      );
    }

    // Parse minutes (format: "32:15" or just a number)
    const parsedMinutes = seasonAvg.min
      ? typeof seasonAvg.min === 'string' && seasonAvg.min.includes(':')
        ? parseFloat(seasonAvg.min.split(':')[0]) + parseFloat(seasonAvg.min.split(':')[1]) / 60
        : parseFloat(seasonAvg.min as string)
      : 0;

    // Upsert into elite_season_stats
    const statsRow = {
      player_id: player.id,
      season: '2025-26',
      league: 'NBA',
      games_played: seasonAvg.games_played || 0,
      ppg: seasonAvg.pts || 0,
      rpg: seasonAvg.reb || 0,
      apg: seasonAvg.ast || 0,
      spg: seasonAvg.stl || 0,
      bpg: seasonAvg.blk || 0,
      topg: seasonAvg.turnover || 0,
      mpg: Math.round(parsedMinutes * 10) / 10,
      fg_pct: Math.round((seasonAvg.fg_pct || 0) * 1000) / 10,
      three_pt_pct: Math.round((seasonAvg.fg3_pct || 0) * 1000) / 10,
      ft_pct: Math.round((seasonAvg.ft_pct || 0) * 1000) / 10,
      fg_made: seasonAvg.fgm || 0,
      fg_attempted: seasonAvg.fga || 0,
      three_pt_made: seasonAvg.fg3m || 0,
      three_pt_attempted: seasonAvg.fg3a || 0,
      ft_made: seasonAvg.ftm || 0,
      ft_attempted: seasonAvg.fta || 0,
      source: 'balldontlie' as const,
      last_synced_at: new Date().toISOString(),
    };

    const { data: upsertedStats, error: upsertError } = await supabase
      .from('elite_season_stats')
      .upsert(statsRow, { onConflict: 'player_id,season' })
      .select()
      .single();

    if (upsertError) {
      console.error('Stats upsert error:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save synced stats' },
        { status: 500 }
      );
    }

    // Transform recent game stats for response
    const recentGames = (recentGamesResult.data || []).map((g: BallDontLieGameStat) => ({
      gameDate: g.game?.date,
      points: g.pts,
      rebounds: g.reb,
      assists: g.ast,
      steals: g.stl,
      blocks: g.blk,
      turnovers: g.turnover,
      minutes: g.min,
      fgm: g.fgm,
      fga: g.fga,
      fg3m: g.fg3m,
      fg3a: g.fg3a,
      ftm: g.ftm,
      fta: g.fta,
    }));

    return NextResponse.json({
      seasonStats: mapSeasonStatsRow(upsertedStats),
      recentGames,
      nbaPlayerId,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('NBA stats sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync NBA stats' },
      { status: 500 }
    );
  }
}
