import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/elite-players - List all elite players (admin view)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const { data: players, error } = await supabase
      .from('elite_players')
      .select('id, slug, first_name, last_name, position, team, bb_level, season_status, is_active')
      .order('last_name', { ascending: true });

    if (error) {
      console.error('Error fetching elite players:', error);
      return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
    }

    // Transform to camelCase
    const transformedPlayers = (players || []).map(p => ({
      id: p.id,
      slug: p.slug,
      firstName: p.first_name,
      lastName: p.last_name,
      position: p.position,
      team: p.team,
      bbLevel: p.bb_level,
      seasonStatus: p.season_status,
      isActive: p.is_active,
    }));

    return NextResponse.json({ players: transformedPlayers });
  } catch (error) {
    console.error('Elite players list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/elite-players - Create a new elite player
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      firstName,
      lastName,
      position,
      team,
      bbLevel = 1,
      seasonStatus = 'in-season',
      accessToken,
    } = body;

    // Generate slug from name
    const slug = `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, '-');

    const { data: player, error } = await supabase
      .from('elite_players')
      .insert({
        slug,
        first_name: firstName,
        last_name: lastName,
        position,
        team,
        bb_level: bbLevel,
        season_status: seasonStatus,
        access_token: accessToken,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating elite player:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Player with this name already exists' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
    }

    return NextResponse.json({
      player: {
        id: player.id,
        slug: player.slug,
        firstName: player.first_name,
        lastName: player.last_name,
        position: player.position,
        team: player.team,
        bbLevel: player.bb_level,
        seasonStatus: player.season_status,
        isActive: player.is_active,
      },
    });
  } catch (error) {
    console.error('Create elite player error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
