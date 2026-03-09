import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth';

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
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    },
  });
}

// PATCH - Update player data (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const { slug } = await params;
    const body = await request.json();
    const { action, ...data } = body;

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
        const today = new Date().toISOString().split('T')[0];
        const { error } = await supabase
          .from('elite_daily_focus')
          .upsert({
            player_id: playerId,
            date: today,
            focus_cue: data.focusCue,
            created_by: data.createdBy || 'Admin',
            created_at: new Date().toISOString(),
          }, {
            onConflict: 'player_id,date',
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'update_limiting_factor': {
        const updateData: any = { updated_at: new Date().toISOString() };
        if (data.name !== undefined) updateData.name = data.name;
        if (data.shortDescription !== undefined) updateData.short_description = data.shortDescription;
        if (data.awarenesssCue !== undefined) updateData.awareness_cue = data.awarenesssCue;
        if (data.severity !== undefined) updateData.priority = data.severity;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.isActive !== undefined) updateData.is_active = data.isActive;
        if (data.failureExample !== undefined) updateData.failure_example = data.failureExample;
        if (data.successExample !== undefined) updateData.success_example = data.successExample;

        console.log('Updating limiting factor:', data.id, updateData);

        const { data: result, error, count } = await supabase
          .from('elite_limiting_factors')
          .update(updateData)
          .eq('id', data.id)
          .select();

        console.log('Update result:', { result, error, count });

        if (error) throw error;
        if (!result || result.length === 0) {
          return NextResponse.json({ error: 'No rows updated - ID not found', id: data.id }, { status: 404 });
        }
        return NextResponse.json({ success: true, updated: result });
      }

      case 'add_limiting_factor': {
        const { error } = await supabase
          .from('elite_limiting_factors')
          .insert({
            player_id: playerId,
            name: data.name,
            short_description: data.shortDescription,
            awareness_cue: data.awarenesssCue,
            priority: data.severity || 'medium',
            notes: data.notes,
            failure_example: data.failureExample || null,
            success_example: data.successExample || null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'delete_limiting_factor': {
        const { error } = await supabase
          .from('elite_limiting_factors')
          .delete()
          .eq('id', data.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'add_game_report': {
        const threePointPct = data.threePointAttempts > 0
          ? (data.threePointMakes / data.threePointAttempts) * 100
          : 0;

        const { error } = await supabase
          .from('elite_game_reports')
          .upsert({
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
            field_goal_makes: data.fieldGoalMakes,
            field_goal_attempts: data.fieldGoalAttempts,
            bb_notes: data.bbNotes,
            hunting_next_game: data.huntingNextGame,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'player_id,game_date' });

        if (error) throw error;
        await updatePlayerStats(supabase, playerId);
        return NextResponse.json({ success: true });
      }

      case 'clear_game_reports': {
        const { error } = await supabase
          .from('elite_game_reports')
          .delete()
          .eq('player_id', playerId);

        if (error) throw error;
        return NextResponse.json({ success: true, message: 'All game reports cleared' });
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
            tags: data.tags || [],
            bb_cue: data.bbCue,
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'delete_video': {
        const { error } = await supabase
          .from('elite_video_clips')
          .delete()
          .eq('id', data.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'update_daily_cues': {
        // Delete existing cues
        await supabase
          .from('elite_daily_cues')
          .delete()
          .eq('player_id', playerId);

        if (data.cues && data.cues.length > 0) {
          const cues = data.cues.map((cue: any, index: number) => ({
            player_id: playerId,
            cue_text: cue.cueText,
            category: cue.category || 'shooting',
            display_order: index,
            is_active: cue.isActive !== false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

          const { error } = await supabase
            .from('elite_daily_cues')
            .insert(cues);

          if (error) throw error;
        }
        return NextResponse.json({ success: true });
      }

      case 'update_player': {
        const updateData: any = { updated_at: new Date().toISOString() };
        if (data.firstName !== undefined) updateData.first_name = data.firstName;
        if (data.lastName !== undefined) updateData.last_name = data.lastName;
        if (data.position !== undefined) updateData.position = data.position;
        if (data.team !== undefined) updateData.team = data.team;
        if (data.teamLogo !== undefined) updateData.team_logo = data.teamLogo;
        if (data.headshotUrl !== undefined) updateData.headshot_url = data.headshotUrl;
        if (data.bbLevel !== undefined) updateData.bb_level = data.bbLevel;
        if (data.bbLevelName !== undefined) updateData.bb_level_name = data.bbLevelName;
        if (data.seasonStatus !== undefined) updateData.season_status = data.seasonStatus;

        const { error } = await supabase
          .from('elite_players')
          .update(updateData)
          .eq('id', playerId);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'add_coach_note': {
        const { error } = await supabase
          .from('elite_coach_notes')
          .insert({
            player_id: playerId,
            date: new Date().toISOString().split('T')[0],
            text: data.text,
            created_by: data.createdBy || 'Admin',
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'delete_coach_note': {
        const { error } = await supabase
          .from('elite_coach_notes')
          .delete()
          .eq('id', data.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'add_voice_note': {
        const { error } = await supabase
          .from('elite_voice_notes')
          .insert({
            player_id: playerId,
            title: data.title,
            url: data.url,
            duration: data.duration,
            transcript: data.transcript,
            created_by: data.createdBy || 'Admin',
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'delete_voice_note': {
        // Get the voice note to find the storage URL
        const { data: voiceNote } = await supabase
          .from('elite_voice_notes')
          .select('url')
          .eq('id', data.id)
          .single();

        // Delete from storage if it's a Supabase URL
        if (voiceNote?.url?.includes('/voice-notes/')) {
          const storagePath = voiceNote.url.split('/voice-notes/').pop();
          if (storagePath) {
            await supabase.storage.from('voice-notes').remove([decodeURIComponent(storagePath)]);
          }
        }

        // Delete DB record
        const { error } = await supabase
          .from('elite_voice_notes')
          .delete()
          .eq('id', data.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      case 'update_weekly_review': {
        const weekEnd = new Date();
        const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Delete existing review for this week (ignore errors if none exists)
        const { error: deleteError } = await supabase
          .from('elite_weekly_reviews')
          .delete()
          .eq('player_id', playerId)
          .gte('week_end', weekStart.toISOString().split('T')[0]);

        if (deleteError) {
          console.log('Delete warning (may be ok):', deleteError);
        }

        const insertData = {
          player_id: playerId,
          week_start: weekStart.toISOString().split('T')[0],
          week_end: weekEnd.toISOString().split('T')[0],
          summary: data.summary || '',
          what_changed: data.whatChanged || [],
          priorities: data.priorities || [],
          shooting_trend: data.shootingTrend || 'stable',
          created_by: data.createdBy || 'Admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log('Inserting weekly review:', insertData);

        const { error } = await supabase
          .from('elite_weekly_reviews')
          .insert(insertData);

        if (error) {
          console.error('Weekly review insert error:', error);
          throw error;
        }
        return NextResponse.json({ success: true });
      }

      case 'update_protocol': {
        const updateData: any = { updated_at: new Date().toISOString() };
        if (data.scoringSettings !== undefined) updateData.scoring_settings = data.scoringSettings;
        if (data.spots !== undefined) updateData.spots = data.spots;
        if (data.shotTypeVariety !== undefined) updateData.shot_type_variety = data.shotTypeVariety;
        if (data.postSection !== undefined) updateData.post_section = data.postSection;
        if (data.offBallPrinciples !== undefined) updateData.off_ball_principles = data.offBallPrinciples;
        if (data.defensePrinciples !== undefined) updateData.defense_principles = data.defensePrinciples;
        if (data.reboundingPrinciples !== undefined) updateData.rebounding_principles = data.reboundingPrinciples;
        if (data.handlePrinciples !== undefined) updateData.handle_principles = data.handlePrinciples;
        if (data.finishingPrinciples !== undefined) updateData.finishing_principles = data.finishingPrinciples;

        const { error } = await supabase
          .from('elite_game_protocols')
          .update(updateData)
          .eq('player_id', playerId);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Admin update error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Internal server error',
        details: error?.details || error?.hint || null,
        code: error?.code || null
      },
      { status: 500 }
    );
  }
}

// Helper function to update rolling stats
async function updatePlayerStats(supabase: any, playerId: string) {
  const { data: games } = await supabase
    .from('elite_game_reports')
    .select('three_point_attempts, three_point_makes')
    .eq('player_id', playerId)
    .order('game_date', { ascending: false })
    .limit(5);

  if (!games || games.length === 0) return;

  const last3 = games.slice(0, Math.min(3, games.length));
  const last5 = games;

  const calc3Pt = (gamesArr: any[]) => {
    const totalAttempts = gamesArr.reduce((sum: number, g: any) => sum + (g.three_point_attempts || 0), 0);
    const totalMakes = gamesArr.reduce((sum: number, g: any) => sum + (g.three_point_makes || 0), 0);
    return totalAttempts > 0 ? (totalMakes / totalAttempts) * 100 : 0;
  };

  const avgVolume = last5.reduce((sum: number, g: any) => sum + (g.three_point_attempts || 0), 0) / last5.length;

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
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const { slug } = await params;
    const body = await request.json();

    const supabase = getSupabaseClient();

    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('elite_player_inputs')
      .insert({
        player_id: player.id,
        date: new Date().toISOString().split('T')[0],
        shot_feeling: body.shotFeeling,
        confidence: body.confidence,
        energy_level: body.energyLevel,
        focus_level: body.focusLevel,
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
