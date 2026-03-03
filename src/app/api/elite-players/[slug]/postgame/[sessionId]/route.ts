import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch all shots for a postgame session + session info
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; sessionId: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { slug, sessionId } = params;

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

    // Get all shots for this session
    const { data: shots, error: shotsError } = await supabase
      .from('elite_postgame_shots')
      .select('*')
      .eq('session_id', sessionId)
      .order('shot_number', { ascending: true });

    if (shotsError) {
      console.error('Shots fetch error:', shotsError);
      return NextResponse.json({ error: 'Failed to fetch shots' }, { status: 500 });
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
        date: session.date,
        title: session.title,
        opponent: session.opponent,
        notes: session.notes,
        createdBy: session.created_by,
        createdAt: session.created_at,
      },
      shots: (shots || []).map(s => ({
        id: s.id,
        shotNumber: s.shot_number,
        result: s.result,
        shotType: s.shot_type,
        missType: s.miss_type,
        timeToShot: s.time_to_shot,
        energyPattern: s.energy_pattern,
        ballPattern: s.ball_pattern,
        followThrough: s.follow_through,
        alignment: s.alignment,
        notes: s.notes,
      })),
    });
  } catch (error) {
    console.error('Postgame shots API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add a shot to a postgame session
export async function POST(
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

    // Verify session exists and belongs to player
    const { data: session, error: sessionError } = await supabase
      .from('elite_training_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('player_id', player.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const shotData = {
      session_id: sessionId,
      player_id: player.id,
      shot_number: body.shotNumber,
      result: body.result,
      shot_type: body.shotType || null,
      miss_type: body.missType || null,
      time_to_shot: body.timeToShot || null,
      energy_pattern: body.energyPattern || null,
      ball_pattern: body.ballPattern || null,
      follow_through: body.followThrough || null,
      alignment: body.alignment || null,
      notes: body.notes || null,
    };

    const { data: shot, error: insertError } = await supabase
      .from('elite_postgame_shots')
      .insert(shotData)
      .select()
      .single();

    if (insertError) {
      console.error('Shot insert error:', insertError);
      return NextResponse.json({ error: 'Failed to add shot' }, { status: 500 });
    }

    return NextResponse.json({ success: true, shot });
  } catch (error) {
    console.error('Shot create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove a shot from a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; sessionId: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { slug, sessionId } = params;

    const url = new URL(request.url);
    const shotId = url.searchParams.get('shotId');

    if (!shotId) {
      return NextResponse.json({ error: 'shotId required' }, { status: 400 });
    }

    // Get player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from('elite_postgame_shots')
      .delete()
      .eq('id', shotId)
      .eq('session_id', sessionId)
      .eq('player_id', player.id);

    if (deleteError) {
      console.error('Shot delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete shot' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Shot delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
