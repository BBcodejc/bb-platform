import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createRouteHandlerClient(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('shooting_evaluations')
      .select(`
        id,
        prospect_id,
        status,
        player_full_name,
        player_level,
        player_age,
        fourteen_spot_round_1_score,
        fourteen_spot_round_2_score,
        fourteen_spot_round_3_score,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: evaluations, error, count } = await query.limit(50);

    if (error) {
      console.error('Error fetching evaluations:', error);
      return NextResponse.json({ error: 'Failed to fetch evaluations' }, { status: 500 });
    }

    // Fetch prospect details for each evaluation
    const prospectIds = evaluations?.map(e => e.prospect_id).filter(Boolean) || [];

    let prospects: Record<string, any> = {};
    if (prospectIds.length > 0) {
      const { data: prospectData } = await supabase
        .from('prospects')
        .select('id, first_name, last_name, email, high_ticket_prospect, pipeline_status')
        .in('id', prospectIds);

      if (prospectData) {
        prospects = Object.fromEntries(prospectData.map(p => [p.id, p]));
      }
    }

    // Combine data
    const enrichedEvaluations = evaluations?.map(evaluation => ({
      ...evaluation,
      prospects: prospects[evaluation.prospect_id] || null,
    })) || [];

    return NextResponse.json({
      evaluations: enrichedEvaluations,
      count: evaluations?.length || 0,
    });
  } catch (error) {
    console.error('Admin evaluations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
