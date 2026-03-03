import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch a single session by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; sessionId: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { slug, sessionId } = params;
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('context') === 'admin';

    // Get player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id, slug, first_name, last_name, team, position')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Get the session
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
        firstName: player.first_name,
        lastName: player.last_name,
        team: player.team,
        position: player.position,
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
        createdBy: session.created_by,
        createdAt: session.created_at,
      },
    });
  } catch (error) {
    console.error('Session detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update a session (e.g., set link, update notes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string; sessionId: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { slug, sessionId } = params;
    const body = await request.json();

    // Get player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Build update object — only include fields that were provided
    const updateData: Record<string, any> = {};
    if (body.link !== undefined) updateData.link = body.link;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.opponent !== undefined) updateData.opponent = body.opponent;
    if (body.focusAreas !== undefined) updateData.focus_areas = body.focusAreas;
    if (body.durationMinutes !== undefined) updateData.duration_minutes = body.durationMinutes;
    if (body.coachingNotes !== undefined) updateData.coaching_notes = body.coachingNotes;
    if (body.coachingNotesVisible !== undefined) updateData.coaching_notes_visible = body.coachingNotesVisible;
    updateData.updated_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('elite_training_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .eq('player_id', player.id);

    if (updateError) {
      console.error('Session update error:', updateError);
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
