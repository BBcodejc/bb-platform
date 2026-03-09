import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { verifyEliteRequest } from '@/lib/elite-auth';
import { mapBlockRow, mapPlanRow } from '@/types/session-library';
import type { SessionPlanWithBlocks } from '@/types/session-library';

export const dynamic = 'force-dynamic';

// GET - Fetch session plan with resolved block details (player or admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; planId: string } }
) {
  try {
    const { slug, planId } = params;
    const { player } = await verifyEliteRequest(request, slug);

    if (!player) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Fetch the session plan
    const { data: planRow, error: planError } = await supabase
      .from('session_plans')
      .select('*')
      .eq('id', planId)
      .eq('player_id', player.id)
      .single();

    if (planError || !planRow) {
      return NextResponse.json({ error: 'Session plan not found' }, { status: 404 });
    }

    const plan = mapPlanRow(planRow);

    // Fetch all blocks referenced by this plan
    const { data: blockRows } = await supabase
      .from('session_blocks')
      .select('*')
      .in('block_id', plan.blockIds);

    // Re-order blocks to match the plan's block_ids ordering
    const blockMap = new Map((blockRows || []).map(b => [b.block_id, b]));
    const orderedBlocks = plan.blockIds
      .map(bid => blockMap.get(bid))
      .filter(Boolean)
      .map(mapBlockRow);

    const planWithBlocks: SessionPlanWithBlocks = {
      ...plan,
      blocks: orderedBlocks,
    };

    return NextResponse.json({ plan: planWithBlocks });
  } catch (error) {
    console.error('Elite session plan GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Player updates (completed blocks, notes, status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string; planId: string } }
) {
  try {
    const { slug, planId } = params;
    const { player } = await verifyEliteRequest(request, slug);

    if (!player) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const body = await request.json();

    // Only allow player-safe fields
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.completedBlocks !== undefined) updateData.completed_blocks = body.completedBlocks;
    if (body.playerNotes !== undefined) updateData.player_notes = body.playerNotes;
    if (body.status !== undefined) updateData.status = body.status;

    const { data: plan, error } = await supabase
      .from('session_plans')
      .update(updateData)
      .eq('id', planId)
      .eq('player_id', player.id)
      .select()
      .single();

    if (error) {
      console.error('Session plan player update error:', error);
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({ success: true, plan: mapPlanRow(plan) });
  } catch (error) {
    console.error('Elite session plan PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
