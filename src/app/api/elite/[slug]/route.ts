import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET - Fetch elite profile (read-only for player, full for admin/coach)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { slug } = params;

    // Get elite player
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('*')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Elite profile not found' }, { status: 404 });
    }

    // Get pregame cues
    const { data: pregameCues } = await supabase
      .from('elite_pregame_cues')
      .select('*')
      .eq('player_id', player.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    // Get limiting factors
    const { data: limitingFactors } = await supabase
      .from('elite_limiting_factors')
      .select('*')
      .eq('player_id', player.id)
      .eq('is_active', true)
      .order('priority', { ascending: true });

    // Get game day protocol
    const { data: protocol } = await supabase
      .from('elite_game_protocols')
      .select('*')
      .eq('player_id', player.id)
      .eq('is_active', true)
      .single();

    // Get weekly review
    const { data: weeklyReview } = await supabase
      .from('elite_weekly_reviews')
      .select('*')
      .eq('player_id', player.id)
      .order('week_start', { ascending: false })
      .limit(1)
      .single();

    // Get coach notes
    const { data: coachNotes } = await supabase
      .from('elite_coach_notes')
      .select('*')
      .eq('player_id', player.id)
      .order('date', { ascending: false })
      .limit(10);

    // Get voice notes
    const { data: voiceNotes } = await supabase
      .from('elite_voice_notes')
      .select('*')
      .eq('player_id', player.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get video clips
    const { data: videoClips } = await supabase
      .from('elite_video_clips')
      .select('*')
      .eq('player_id', player.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent games
    const { data: recentGames } = await supabase
      .from('elite_game_reports')
      .select('*')
      .eq('player_id', player.id)
      .order('game_date', { ascending: false })
      .limit(5);

    // Transform data
    const dashboard = {
      player: {
        id: player.id,
        slug: player.slug,
        name: player.name,
        firstName: player.name?.split(' ')[0] || '',
        lastName: player.name?.split(' ').slice(1).join(' ') || '',
        position: player.position || '',
        team: player.team || '',
        teamLogo: player.team_logo,
        headshotUrl: player.photo_url,
        seasonStatus: player.season_status || 'in-season',
        isActive: player.is_active !== false,
      },
      pregameCues: (pregameCues || []).map(cue => ({
        id: cue.id,
        playerId: cue.player_id,
        text: cue.cue_text,
        category: cue.category,
        icon: cue.icon,
        displayOrder: cue.display_order,
        isActive: cue.is_active,
      })),
      limitingFactors: (limitingFactors || []).map(lf => ({
        id: lf.id,
        playerId: lf.player_id,
        name: lf.name,
        shortDescription: lf.short_description,
        awarenessCue: lf.awareness_cue,
        severity: lf.severity || 'medium',
        priority: lf.priority || 1,
        notes: lf.notes,
        failureVideoUrl: lf.failure_example?.url,
        successVideoUrl: lf.success_example?.url,
        isActive: lf.is_active,
      })),
      gameDayProtocol: protocol ? {
        id: protocol.id,
        playerId: protocol.player_id,
        name: protocol.name,
        duration: protocol.duration,
        spots: protocol.spots || [],
        shotTypes: protocol.shot_type_variety || [],
        principles: protocol.off_ball_principles || [],
        isActive: protocol.is_active,
      } : null,
      weeklyReview: weeklyReview ? {
        id: weeklyReview.id,
        playerId: weeklyReview.player_id,
        weekStart: weeklyReview.week_start,
        weekEnd: weeklyReview.week_end,
        summary: weeklyReview.summary,
        whatChanged: weeklyReview.what_changed || [],
        priorities: weeklyReview.priorities || [],
        createdBy: weeklyReview.created_by,
        createdAt: weeklyReview.created_at,
      } : null,
      coachNotes: (coachNotes || []).map(note => ({
        id: note.id,
        playerId: note.player_id,
        date: note.date,
        text: note.text,
        createdBy: note.created_by,
        createdAt: note.created_at,
      })),
      voiceNotes: (voiceNotes || []).map(note => ({
        id: note.id,
        playerId: note.player_id,
        title: note.title,
        url: note.url,
        duration: note.duration,
        transcript: note.transcript,
        createdBy: note.created_by,
        createdAt: note.created_at,
      })),
      videoClips: (videoClips || []).map(clip => ({
        id: clip.id,
        playerId: clip.player_id,
        title: clip.title,
        url: clip.url,
        thumbnailUrl: clip.thumbnail_url,
        tags: clip.tags || [],
        bbCue: clip.bb_cue,
        category: clip.category,
        createdAt: clip.created_at,
      })),
      recentGames: (recentGames || []).map(game => ({
        id: game.id,
        playerId: game.player_id,
        opponent: game.opponent,
        opponentLogo: game.opponent_logo,
        gameDate: game.game_date,
        isHome: game.is_home,
        minutesPlayed: game.minutes_played,
        points: game.points,
        threePointAttempts: game.three_point_attempts,
        threePointMakes: game.three_point_makes,
        bbNotes: game.bb_notes,
        huntingNextGame: game.hunting_next_game,
        createdAt: game.created_at,
      })),
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Elite profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
