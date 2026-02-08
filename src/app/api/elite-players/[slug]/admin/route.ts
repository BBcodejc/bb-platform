import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

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

// PATCH - Update player data (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action, data } = body;

    const supabase = getSupabaseClient();

    // Get player ID from slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const playerId = player.id;

    switch (action) {
      case 'update_focus': {
        // Upsert today's focus
        const today = new Date().toISOString().split('T')[0];
        const { error } = await supabase
          .from('elite_daily_focus')
          .upsert({
            player_id: playerId,
            date: today,
            focus_cue: data.focusCue,
            created_by: 'admin',
            created_at: new Date().toISOString(),
          }, {
            onConflict: 'player_id,date',
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'update_limiting_factor': {
        const { error } = await supabase
          .from('elite_limiting_factors')
          .update({
            name: data.name,
            short_description: data.shortDescription,
            awareness_cue: data.awarenessCue,
            priority: data.priority,
            is_active: data.isActive,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'add_limiting_factor': {
        const { error } = await supabase
          .from('elite_limiting_factors')
          .insert({
            player_id: playerId,
            name: data.name,
            short_description: data.shortDescription,
            awareness_cue: data.awarenessCue,
            priority: data.priority || 'medium',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'add_game_report': {
        const threePointPct = data.threePointAttempts > 0
          ? (data.threePointMakes / data.threePointAttempts) * 100
          : 0;

        const { error } = await supabase
          .from('elite_game_reports')
          .insert({
            player_id: playerId,
            opponent: data.opponent,
            opponent_logo: data.opponentLogo,
            game_date: data.gameDate,
            is_home: data.isHome,
            minutes_played: data.minutesPlayed,
            three_point_attempts: data.threePointAttempts,
            three_point_makes: data.threePointMakes,
            three_point_percentage: threePointPct,
            points: data.points,
            bb_notes: data.bbNotes,
            hunting_next_game: data.huntingNextGame,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;

        // Update rolling stats
        await updatePlayerStats(supabase, playerId);

        return NextResponse.json({ success: true });
      }

      case 'update_game_report': {
        const threePointPct = data.threePointAttempts > 0
          ? (data.threePointMakes / data.threePointAttempts) * 100
          : 0;

        const { error } = await supabase
          .from('elite_game_reports')
          .update({
            opponent: data.opponent,
            opponent_logo: data.opponentLogo,
            game_date: data.gameDate,
            is_home: data.isHome,
            minutes_played: data.minutesPlayed,
            three_point_attempts: data.threePointAttempts,
            three_point_makes: data.threePointMakes,
            three_point_percentage: threePointPct,
            points: data.points,
            bb_notes: data.bbNotes,
            hunting_next_game: data.huntingNextGame,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.id);

        if (error) throw error;

        // Update rolling stats
        await updatePlayerStats(supabase, playerId);

        return NextResponse.json({ success: true });
      }

      case 'add_video': {
        const { error } = await supabase
          .from('elite_video_clips')
          .insert({
            player_id: playerId,
            game_id: data.gameId,
            title: data.title,
            url: data.url,
            thumbnail_url: data.thumbnailUrl,
            tags: data.tags,
            bb_cue: data.bbCue,
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'update_daily_cues': {
        // Delete existing cues and insert new ones
        await supabase
          .from('elite_daily_cues')
          .delete()
          .eq('player_id', playerId);

        const cues = data.cues.map((cue: any, index: number) => ({
          player_id: playerId,
          cue_text: cue.cueText,
          category: cue.category,
          display_order: index,
          is_active: cue.isActive !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error } = await supabase
          .from('elite_daily_cues')
          .insert(cues);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'update_player': {
        const { error } = await supabase
          .from('elite_players')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            position: data.position,
            team: data.team,
            team_logo: data.teamLogo,
            headshot_url: data.headshotUrl,
            bb_level: data.bbLevel,
            season_status: data.seasonStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', playerId);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update rolling stats
async function updatePlayerStats(supabase: any, playerId: string) {
  // Get last 5 games
  const { data: games } = await supabase
    .from('elite_game_reports')
    .select('three_point_attempts, three_point_makes')
    .eq('player_id', playerId)
    .order('game_date', { ascending: false })
    .limit(5);

  if (!games || games.length === 0) return;

  // Calculate rolling averages
  const last3 = games.slice(0, Math.min(3, games.length));
  const last5 = games;

  const calc3Pt = (gamesArr: any[]) => {
    const totalAttempts = gamesArr.reduce((sum, g) => sum + (g.three_point_attempts || 0), 0);
    const totalMakes = gamesArr.reduce((sum, g) => sum + (g.three_point_makes || 0), 0);
    return totalAttempts > 0 ? (totalMakes / totalAttempts) * 100 : 0;
  };

  const avgVolume = last5.reduce((sum: number, g: any) => sum + (g.three_point_attempts || 0), 0) / last5.length;

  // Determine streak
  let streak: 'hot' | 'cold' | 'neutral' = 'neutral';
  let streakGames = 0;

  for (const game of games) {
    const pct = game.three_point_attempts > 0
      ? (game.three_point_makes / game.three_point_attempts) * 100
      : 0;

    if (streakGames === 0) {
      if (pct >= 40) {
        streak = 'hot';
        streakGames = 1;
      } else if (pct < 30) {
        streak = 'cold';
        streakGames = 1;
      } else {
        break;
      }
    } else {
      if ((streak === 'hot' && pct >= 40) || (streak === 'cold' && pct < 30)) {
        streakGames++;
      } else {
        break;
      }
    }
  }

  // Upsert stats
  await supabase
    .from('elite_player_stats')
    .upsert({
      player_id: playerId,
      rolling_3_game_3pt: calc3Pt(last3),
      rolling_5_game_3pt: calc3Pt(last5),
      avg_shot_volume: avgVolume,
      current_streak: streak,
      streak_games: streakGames,
      last_updated: new Date().toISOString(),
    }, {
      onConflict: 'player_id',
    });
}

// POST - Add player input (player-facing)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const supabase = getSupabaseClient();

    // Get player ID from slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Add player input
    const { error } = await supabase
      .from('elite_player_inputs')
      .insert({
        player_id: player.id,
        date: new Date().toISOString().split('T')[0],
        shot_feeling: body.shotFeeling,
        confidence: body.confidence,
        notes: body.notes,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Player input error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
