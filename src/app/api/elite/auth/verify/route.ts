import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/elite/auth/verify?slug=xxx - Check if cookie token is valid for given slug
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  const token = request.cookies.get('bb-elite-token')?.value;

  if (!token || !slug) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const { data: player, error } = await supabase
    .from('elite_players')
    .select('id, slug, first_name, last_name, is_active')
    .eq('access_token', token)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !player) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  // Update last_active_at
  await supabase
    .from('elite_players')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', player.id);

  return NextResponse.json({
    valid: true,
    playerId: player.id,
    playerName: `${player.first_name} ${player.last_name}`,
  });
}
