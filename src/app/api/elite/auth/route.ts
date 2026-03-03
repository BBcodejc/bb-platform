import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST /api/elite/auth - Validate token and set cookie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Look up player by access_token
    const { data: player, error } = await supabase
      .from('elite_players')
      .select('id, slug, first_name, last_name, is_active, access_token')
      .eq('access_token', token.trim())
      .single();

    if (error || !player) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!player.is_active) {
      return NextResponse.json({ error: 'Access has been revoked' }, { status: 403 });
    }

    // Log the login event
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await supabase.from('elite_login_history').insert({
      player_id: player.id,
      ip_address: ip,
      user_agent: userAgent,
    });

    // Update last_active_at
    await supabase
      .from('elite_players')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', player.id);

    // Set httpOnly cookie and return player slug
    const response = NextResponse.json({
      success: true,
      slug: player.slug,
      playerName: `${player.first_name} ${player.last_name}`,
    });

    response.cookies.set('bb-elite-token', token.trim(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Elite auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/elite/auth - Logout (clear cookie)
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('bb-elite-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
