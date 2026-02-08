import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: prospectId } = await params;
    const supabase = createServerSupabaseClient();

    // Get shooting evaluation with plan data
    const { data: evaluation, error: evalError } = await supabase
      .from('shooting_evaluations')
      .select('*')
      .eq('prospect_id', prospectId)
      .single();

    if (evalError || !evaluation) {
      return NextResponse.json(
        { error: 'Evaluation not found' },
        { status: 404 }
      );
    }

    // Check if evaluation has been delivered
    if (evaluation.status !== 'approved' && evaluation.assessment_status !== 'delivered') {
      return NextResponse.json(
        { error: 'Plan not available yet' },
        { status: 404 }
      );
    }

    // Get prospect info
    const { data: prospect } = await supabase
      .from('prospects')
      .select('first_name, last_name')
      .eq('id', prospectId)
      .single();

    const playerName = evaluation.player_full_name ||
      `${prospect?.first_name || ''} ${prospect?.last_name || ''}`.trim() ||
      'Player';

    return NextResponse.json({
      playerName,
      bbLevel: evaluation.bb_level || 1,
      structuredSevenDayPlan: evaluation.structured_seven_day_plan || null,
      playerPlanLogs: evaluation.player_plan_logs || [],
      status: evaluation.status,
    });
  } catch (error) {
    console.error('Get plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: prospectId } = await params;
    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Update player logs
    const { error } = await supabase
      .from('shooting_evaluations')
      .update({
        player_plan_logs: body.playerPlanLogs,
        updated_at: new Date().toISOString(),
      })
      .eq('prospect_id', prospectId);

    if (error) {
      console.error('Update plan logs error:', error);
      return NextResponse.json(
        { error: 'Failed to save progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
