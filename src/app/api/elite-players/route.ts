import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/elite-players - List all elite players (admin view)
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();

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
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const body = await request.json();

    const {
      firstName,
      lastName,
      position,
      team,
      bbLevel = 1,
      seasonStatus = 'in-season',
      accessToken,
      headshotUrl,
      teamLogo,
    } = body;

    // Generate slug from name
    const slug = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');

    // Auto-generate access token if not provided
    const token = accessToken || `${firstName.toLowerCase().charAt(0)}${lastName.toLowerCase().replace(/\s+/g, '')}-bb-${new Date().getFullYear()}`;

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
        access_token: token,
        headshot_url: headshotUrl || null,
        team_logo: teamLogo || null,
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
        accessToken: player.access_token,
        headshotUrl: player.headshot_url,
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
