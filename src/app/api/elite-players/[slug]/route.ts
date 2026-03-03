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
  PregameCue,
  PlayerInput,
  GameDayProtocol,
  WeeklyReview,
  CoachNote,
  VoiceNote,
} from '@/types/elite-player';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  // Create a completely fresh client each time with cache-busting
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'x-cache-bust': Date.now().toString(),
      },
      fetch: (url, options) => {
        // Force no caching on fetch
        return fetch(url, {
          ...options,
          cache: 'no-store',
          next: { revalidate: 0 },
        });
      },
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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

    // Fetch all related data in parallel
    const [
      focusResult,
      factorsResult,
      gamesResult,
      statsResult,
      videosResult,
      cuesResult,
      inputsResult,
      protocolResult,
      weeklyResult,
      coachNotesResult,
      voiceNotesResult,
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

      // Daily cues (pregame cues)
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

      // Game Day Protocol
      supabase
        .from('elite_game_protocols')
        .select('*')
        .eq('player_id', player.id)
        .single(),

      // Weekly Review (most recent)
      supabase
        .from('elite_weekly_reviews')
        .select('*')
        .eq('player_id', player.id)
        .order('week_end', { ascending: false })
        .limit(1),

      // Coach Notes (last 10)
      supabase
        .from('elite_coach_notes')
        .select('*')
        .eq('player_id', player.id)
        .order('date', { ascending: false })
        .limit(10),

      // Voice Notes
      supabase
        .from('elite_voice_notes')
        .select('*')
        .eq('player_id', player.id)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    const pregameCues = (cuesResult.data || []).map(transformCue);

    // Transform to camelCase for frontend
    const dashboard: ElitePlayerDashboard = {
      player: transformPlayer(player),
      todaysFocus: focusResult.data?.[0] ? transformFocus(focusResult.data[0]) : null,
      pregameCues,
      limitingFactors: (factorsResult.data || []).map(transformFactor),
      gameDayProtocol: protocolResult.data ? transformProtocol(protocolResult.data) : null,
      weeklyReview: weeklyResult.data?.[0] ? transformWeeklyReview(weeklyResult.data[0]) : null,
      recentGames: (gamesResult.data || []).map(transformGame),
      stats: statsResult.data ? transformStats(statsResult.data) : null,
      videoLibrary: (videosResult.data || []).map(transformVideo),
      coachNotes: (coachNotesResult.data || []).map(transformCoachNote),
      voiceNotes: (voiceNotesResult.data || []).map(transformVoiceNote),
      dailyCues: pregameCues, // alias for backwards compatibility
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
    bbLevelName: data.bb_level_name,
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
    severity: data.severity || data.priority,
    priority: data.priority,
    notes: data.notes,
    failureExample: data.failure_example || undefined,
    successExample: data.success_example || undefined,
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

function transformCue(data: any): PregameCue {
  return {
    id: data.id,
    playerId: data.player_id,
    cueText: data.cue_text,
    category: data.category || 'shooting',
    icon: data.icon,
    priority: data.priority,
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
    energyLevel: data.energy_level,
    focusLevel: data.focus_level,
    notes: data.notes,
    createdAt: data.created_at,
  };
}

function transformProtocol(data: any): GameDayProtocol {
  return {
    id: data.id,
    playerId: data.player_id,
    name: data.name,
    duration: data.duration,
    scoringSettings: data.scoring_settings,
    spots: data.spots,
    shotTypeVariety: data.shot_type_variety,
    postSection: data.post_section,
    offBallPrinciples: data.off_ball_principles,
    defensePrinciples: data.defense_principles,
    reboundingPrinciples: data.rebounding_principles,
    handlePrinciples: data.handle_principles,
    finishingPrinciples: data.finishing_principles,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function transformWeeklyReview(data: any): WeeklyReview {
  return {
    id: data.id,
    playerId: data.player_id,
    weekStart: data.week_start,
    weekEnd: data.week_end,
    summary: data.summary,
    whatChanged: data.what_changed,
    priorities: data.priorities,
    shootingTrend: data.shooting_trend,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function transformCoachNote(data: any): CoachNote {
  return {
    id: data.id,
    playerId: data.player_id,
    date: data.date,
    text: data.text,
    createdBy: data.created_by,
    createdAt: data.created_at,
  };
}

function transformVoiceNote(data: any): VoiceNote {
  return {
    id: data.id,
    playerId: data.player_id,
    title: data.title,
    url: data.url,
    duration: data.duration,
    transcript: data.transcript,
    createdBy: data.created_by,
    createdAt: data.created_at,
  };
}
