import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createServiceRoleClient } from '@/lib/supabase';
import { mapHighlightRow } from '@/types/elite-player';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();

    // Look up player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      highlightDate,
      category,
      statLine,
      opponent,
      videoUrl,
      isPinned,
      createdBy,
    } = body;

    if (!title || !highlightDate || !category) {
      return NextResponse.json(
        { error: 'Title, highlight date, and category are required' },
        { status: 400 }
      );
    }

    const row = {
      player_id: player.id,
      title,
      description: description ?? null,
      highlight_date: highlightDate,
      category,
      stat_line: statLine ?? null,
      opponent: opponent ?? null,
      video_url: videoUrl ?? null,
      is_pinned: isPinned ?? false,
      created_by: createdBy ?? null,
    };

    const { data, error } = await supabase
      .from('elite_highlights')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Highlight insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save highlight' },
        { status: 500 }
      );
    }

    return NextResponse.json(mapHighlightRow(data), { status: 201 });
  } catch (error) {
    console.error('Highlight error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();

    // Look up player by slug (to verify the slug is valid)
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const highlightId = searchParams.get('id');

    if (!highlightId) {
      return NextResponse.json(
        { error: 'Highlight id is required as query parameter' },
        { status: 400 }
      );
    }

    // Delete only if it belongs to this player
    const { error } = await supabase
      .from('elite_highlights')
      .delete()
      .eq('id', highlightId)
      .eq('player_id', player.id);

    if (error) {
      console.error('Highlight delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete highlight' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Highlight delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
