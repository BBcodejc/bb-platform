import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type {
  ElitePlayerDashboard,
  ElitePlayer,
  DailyFocus,
  LimitingFactor,
  GameScoutingReport,
  PlayerStats,
  VideoClip,
  DailyCue,
  PlayerInput,
} from '@/types/elite-player';

export const dynamic = 'force-dynamic';

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    const supabase = getSupabaseClient();

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

    // Check access token if required
    if (player.access_token && player.access_token !== token) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid access token' },
        { status: 401 }
      );
    }

    // Fetch all related data in parallel
    const [
      focusResult,
      factorsResult,
      gamesResult,
      statsResult,
      videosResult,
      cuesResult,
      inputsResult,
    ] = await Promise.all([
      // Today's focus
      supabase
        .from('elite_daily_focus')
        .select('*')
        .eq('player_id', player.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false })
        .limit(1),

      // Limiting factors
      supabase
        .from('elite_limiting_factors')
        .select('*')
        .eq('player_id', player.id)
        .eq('is_active', true)
        .order('priority'),

      // Recent games (last 10)
      supabase
        .from('elite_game_reports')
        .select('*')
        .eq('player_id', player.id)
        .order('game_date', { ascending: false })
        .limit(10),

      // Stats
      supabase
        .from('elite_player_stats')
        .select('*')
        .eq('player_id', player.id)
        .single(),

      // Video library
      supabase
        .from('elite_video_clips')
        .select('*')
        .eq('player_id', player.id)
        .order('created_at', { ascending: false })
        .limit(50),

      // Daily cues
      supabase
        .from('elite_daily_cues')
        .select('*')
        .eq('player_id', player.id)
        .eq('is_active', true)
        .order('display_order'),

      // Recent player inputs (last 7 days)
      supabase
        .from('elite_player_inputs')
        .select('*')
        .eq('player_id', player.id)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false }),
    ]);

    // Transform to camelCase for frontend
    const dashboard: ElitePlayerDashboard = {
      player: transformPlayer(player),
      todaysFocus: focusResult.data?.[0] ? transformFocus(focusResult.data[0]) : null,
      limitingFactors: (factorsResult.data || []).map(transformFactor),
      recentGames: (gamesResult.data || []).map(transformGame),
      stats: statsResult.data ? transformStats(statsResult.data) : null,
      videoLibrary: (videosResult.data || []).map(transformVideo),
      dailyCues: (cuesResult.data || []).map(transformCue),
      recentInputs: (inputsResult.data || []).map(transformInput),
    };

    return NextResponse.json(dashboard, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Elite player fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Transform functions (snake_case to camelCase)
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
    seasonStatus: data.season_status,
    accessToken: data.access_token,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function transformFocus(data: any): DailyFocus {
  return {
    id: data.id,
    playerId: data.player_id,
    date: data.date,
    focusCue: data.focus_cue,
    createdBy: data.created_by,
    createdAt: data.created_at,
  };
}

function transformFactor(data: any): LimitingFactor {
  return {
    id: data.id,
    playerId: data.player_id,
    name: data.name,
    shortDescription: data.short_description,
    awarenesssCue: data.awareness_cue,
    priority: data.priority,
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
    createdAt: data.created_at,
  };
}

function transformCue(data: any): DailyCue {
  return {
    id: data.id,
    playerId: data.player_id,
    cueText: data.cue_text,
    category: data.category,
    displayOrder: data.display_order,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function transformInput(data: any): PlayerInput {
  return {
    id: data.id,
    playerId: data.player_id,
    date: data.date,
    shotFeeling: data.shot_feeling,
    confidence: data.confidence,
    notes: data.notes,
    createdAt: data.created_at,
  };
}
