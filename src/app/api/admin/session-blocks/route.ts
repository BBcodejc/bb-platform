import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { mapBlockRow } from '@/types/session-library';

export const dynamic = 'force-dynamic';

// GET - Fetch all session blocks, optionally filtered
// ?category=shooting&maxPhase=3
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const maxPhase = url.searchParams.get('maxPhase');

    let query = supabase
      .from('session_blocks')
      .select('*')
      .order('block_id', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (maxPhase) {
      query = query.lte('min_phase', parseInt(maxPhase));
    }

    const { data: blocks, error } = await query;

    if (error) {
      console.error('Session blocks fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
    }

    return NextResponse.json({
      blocks: (blocks || []).map(mapBlockRow),
    });
  } catch (error) {
    console.error('Session blocks API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
