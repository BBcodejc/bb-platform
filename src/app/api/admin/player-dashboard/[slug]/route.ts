import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createServiceRoleClient } from '@/lib/supabase';
import {
  mapSeasonStatsRow,
  mapBBMetricsRow,
  mapHighlightRow,
  mapDashboardClipRow,
  type PlayerDashboardData,
  type GameScoutingReport,
  type PlayerStats,
  type VideoClip,
  type ElitePlayer,
} from '@/types/elite-player';

export const dynamic = 'force-dynamic';

function transformPlayer(data: any): ElitePlayer {
  return {
    id: data.id,
    slug: data.slug,
    firstName: data.first_name,
    lastName: data.last_name,
    position: data.position,
    team: data.team,
    teamLogo: data.team_logo,
    headshotUrl: data.headshot_url,
    bbLevel: data.bb_level,
    bbLevelName: data.bb_level_name,
    seasonStatus: data.season_status,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function transformGame(data: any): GameScoutingReport {
  return {
    id: data.id,
    playerId: data.player_id,
    opponent: data.opponent,
    opponentLogo: data.opponent_logo,
    gameDate: data.game_date,
    isHome: data.is_home,
    minutesPlayed: data.minutes_played,
    threePointAttempts: data.three_point_attempts,
    threePointMakes: data.three_point_makes,
    threePointPercentage: data.three_point_percentage,
    points: data.points,
    fieldGoalAttempts: data.field_goal_attempts,
    fieldGoalMakes: data.field_goal_makes,
    bbNotes: data.bb_notes,
    huntingNextGame: data.hunting_next_game,
    videoClips: data.video_clips || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function transformStats(data: any): PlayerStats {
  return {
    id: data.id,
    playerId: data.player_id,
    rolling3Game3PT: data.rolling_3_game_3pt,
    rolling5Game3PT: data.rolling_5_game_3pt,
    avgShotVolume: data.avg_shot_volume,
    currentStreak: data.current_streak,
    streakGames: data.streak_games,
    backRimPercentage: data.back_rim_percentage,
    directionalMissPercentage: data.directional_miss_percentage,
    lastUpdated: data.last_updated,
  };
}

function transformVideo(data: any): VideoClip {
  return {
    id: data.id,
    playerId: data.player_id,
    gameId: data.game_id,
    title: data.title,
    url: data.url,
    thumbnailUrl: data.thumbnail_url,
    duration: data.duration,
    tags: data.tags || [],
    bbCue: data.bb_cue,
    category: data.category,
    createdAt: data.created_at,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

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

    const playerId = player.id;
    const today = new Date().toISOString().split('T')[0];

    // Fetch all related data in parallel
    const [
      seasonStatsResult,
      gameReportsResult,
      bbMetricsResult,
      trainingSessionsResult,
      highlightsResult,
      dashboardClipsResult,
      playerStatsResult,
      videoClipsResult,
    ] = await Promise.all([
      // Season stats (most recent)
      supabase
        .from('elite_season_stats')
        .select('*')
        .eq('player_id', playerId)
        .order('season', { ascending: false })
        .limit(1),

      // Recent game reports
      supabase
        .from('elite_game_reports')
        .select('*')
        .eq('player_id', playerId)
        .order('game_date', { ascending: false })
        .limit(10),

      // BB metrics (most recent)
      supabase
        .from('elite_bb_metrics')
        .select('*')
        .eq('player_id', playerId)
        .order('metric_date', { ascending: false })
        .limit(1),

      // Upcoming training sessions
      supabase
        .from('elite_training_sessions')
        .select('*')
        .eq('player_id', playerId)
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(7),

      // Highlights
      supabase
        .from('elite_highlights')
        .select('*')
        .eq('player_id', playerId)
        .order('highlight_date', { ascending: false })
        .limit(10),

      // Dashboard clips (active, ordered)
      supabase
        .from('elite_dashboard_clips')
        .select('*')
        .eq('player_id', playerId)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(6),

      // Rolling stats
      supabase
        .from('elite_player_stats')
        .select('*')
        .eq('player_id', playerId)
        .single(),

      // Fallback video clips
      supabase
        .from('elite_video_clips')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(6),
    ]);

    // Map all rows using the type mappers
    const seasonStats = seasonStatsResult.data?.[0]
      ? mapSeasonStatsRow(seasonStatsResult.data[0])
      : null;

    const recentGames = (gameReportsResult.data || []).map(transformGame);

    const bbMetrics = bbMetricsResult.data?.[0]
      ? mapBBMetricsRow(bbMetricsResult.data[0])
      : null;

    const upcomingSessions = (trainingSessionsResult.data || []).map((s: any) => ({
      id: s.id,
      date: s.date,
      sessionType: s.session_type,
      title: s.title,
      description: s.description,
    }));

    const highlights = (highlightsResult.data || []).map(mapHighlightRow);

    const clips = (dashboardClipsResult.data || []).map(mapDashboardClipRow);

    const rollingStats = playerStatsResult.data
      ? transformStats(playerStatsResult.data)
      : null;

    const videoClips = (videoClipsResult.data || []).map(transformVideo);

    // Auto-generate notable moments from game data
    const autoHighlights: Array<{
      id: string;
      type: 'auto';
      title: string;
      date: string;
      statLine?: string;
      opponent?: string;
      category: string;
    }> = [];

    for (const game of recentGames) {
      const pts = game.points ?? 0;
      const threePct = game.threePointAttempts > 0
        ? (game.threePointMakes / game.threePointAttempts) * 100
        : 0;

      if (pts >= 20) {
        autoHighlights.push({
          id: `auto-pts-${game.id}`,
          type: 'auto',
          title: `${pts} PTS ${game.isHome ? 'vs' : '@'} ${game.opponent}`,
          date: game.gameDate,
          statLine: `${pts} PTS, ${game.threePointMakes}/${game.threePointAttempts} 3PT`,
          opponent: game.opponent,
          category: 'game',
        });
      } else if (threePct >= 40 && game.threePointAttempts >= 3) {
        autoHighlights.push({
          id: `auto-3pt-${game.id}`,
          type: 'auto',
          title: `${threePct.toFixed(0)}% from three ${game.isHome ? 'vs' : '@'} ${game.opponent}`,
          date: game.gameDate,
          statLine: `${game.threePointMakes}/${game.threePointAttempts} 3PT (${threePct.toFixed(0)}%)`,
          opponent: game.opponent,
          category: 'game',
        });
      }
    }

    const dashboard: PlayerDashboardData = {
      player: transformPlayer(player),
      seasonStats,
      recentGames,
      bbMetrics,
      rollingStats,
      upcomingSessions,
      highlights,
      clips,
      videoClips,
      autoHighlights,
    };

    return NextResponse.json(dashboard, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Player dashboard fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
