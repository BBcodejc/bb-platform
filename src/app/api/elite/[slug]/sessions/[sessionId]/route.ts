import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { verifyEliteRequest } from '@/lib/elite-auth';

export const dynamic = 'force-dynamic';

// GET - Fetch a single session (token or admin auth)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; sessionId: string } }
) {
  try {
    const { slug, sessionId } = params;
    const { player, isAdmin } = await verifyEliteRequest(request, slug);

    if (!player) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    const { data: session, error: sessionError } = await supabase
      .from('elite_training_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('player_id', player.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      player: {
        id: player.id,
        slug: player.slug,
        firstName: player.firstName,
        lastName: player.lastName,
      },
      session: {
        id: session.id,
        playerId: session.player_id,
        date: session.date,
        sessionType: session.session_type,
        title: session.title,
        description: session.description,
        durationMinutes: session.duration_minutes,
        location: session.location,
        opponent: session.opponent,
        focusAreas: session.focus_areas || [],
        notes: session.notes,
        coachingNotes: isAdmin ? session.coaching_notes : (session.coaching_notes_visible ? session.coaching_notes : null),
        coachingNotesVisible: session.coaching_notes_visible ?? false,
        link: session.link,
        videoUrl: session.video_url,
        videoUrlClient: session.video_url_client,
        bestTestOfDay: session.best_test_of_day,
        createdBy: session.created_by,
        createdAt: session.created_at,
        sessionPlanId: session.session_plan_id || null,
      },
    });
  } catch (error) {
    console.error('Elite session detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
