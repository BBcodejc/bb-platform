import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - List all postgame sessions for a player
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { slug } = params;

    // Get player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id, slug, first_name, last_name')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Fetch postgame sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('elite_training_sessions')
      .select('*')
      .eq('player_id', player.id)
      .eq('session_type', 'postgame')
      .order('date', { ascending: false });

    if (sessionsError) {
      console.error('Postgame sessions fetch error:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch postgame sessions' }, { status: 500 });
    }

    // For each session, get shot count summary
    const sessionsWithCounts = await Promise.all(
      (sessions || []).map(async (s) => {
        const { count: totalShots } = await supabase
          .from('elite_postgame_shots')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', s.id);

        const { count: makes } = await supabase
          .from('elite_postgame_shots')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', s.id)
          .eq('result', 'make');

        return {
          id: s.id,
          playerId: s.player_id,
          date: s.date,
          sessionType: s.session_type,
          title: s.title,
          opponent: s.opponent,
          notes: s.notes,
          link: s.link,
          createdBy: s.created_by,
          createdAt: s.created_at,
          totalShots: totalShots || 0,
          makes: makes || 0,
          misses: (totalShots || 0) - (makes || 0),
        };
      })
    );

    return NextResponse.json({
      player: {
        id: player.id,
        slug: player.slug,
        firstName: player.first_name,
        lastName: player.last_name,
      },
      sessions: sessionsWithCounts,
    });
  } catch (error) {
    console.error('Postgame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new postgame session
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { slug } = params;
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

    const sessionData = {
      player_id: player.id,
      date: body.date,
      session_type: 'postgame',
      title: body.title || `Post-Game Analysis — vs ${body.opponent || 'Unknown'}`,
      opponent: body.opponent || null,
      notes: body.notes || null,
      link: null, // Will be set after creation with the report URL
      created_by: body.createdBy || 'Coach Jake',
    };

    const { data: session, error: insertError } = await supabase
      .from('elite_training_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create postgame session' }, { status: 500 });
    }

    // Update the link to point to the report page
    const reportLink = `/elite/${slug}/postgame/${session.id}`;
    await supabase
      .from('elite_training_sessions')
      .update({ link: reportLink })
      .eq('id', session.id);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        date: session.date,
        title: session.title,
        opponent: session.opponent,
        link: reportLink,
      },
    });
  } catch (error) {
    console.error('Postgame create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
