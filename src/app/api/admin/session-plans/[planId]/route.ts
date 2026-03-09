import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { mapPlanRow } from '@/types/session-library';

export const dynamic = 'force-dynamic';

// PATCH - Update a session plan (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { planId: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { planId } = params;
    const body = await request.json();

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.blockIds !== undefined) updateData.block_ids = body.blockIds;
    if (body.blockNotes !== undefined) updateData.block_notes = body.blockNotes;
    if (body.coachingNotes !== undefined) updateData.coaching_notes = body.coachingNotes;
    if (body.templateName !== undefined) updateData.template_name = body.templateName;
    if (body.templateId !== undefined) updateData.template_id = body.templateId;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.totalDurationMinutes !== undefined) updateData.total_duration_minutes = body.totalDurationMinutes;

    const { data: plan, error } = await supabase
      .from('session_plans')
      .update(updateData)
      .eq('id', planId)
      .select()
      .single();

    if (error) {
      console.error('Session plan update error:', error);
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
    }

    // Also update the linked training session if it exists
    if (body.coachingNotes !== undefined || body.templateName !== undefined || body.blockIds !== undefined) {
      const sessionUpdate: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (body.coachingNotes !== undefined) {
        sessionUpdate.coaching_notes = body.coachingNotes;
        sessionUpdate.coaching_notes_visible = !!body.coachingNotes;
      }
      if (body.templateName !== undefined) {
        sessionUpdate.title = body.templateName;
      }

      // If blocks changed, recalculate duration and notes
      if (body.blockIds !== undefined) {
        const { data: blocks } = await supabase
          .from('session_blocks')
          .select('block_id, name, duration_minutes')
          .in('block_id', body.blockIds);

        const blockMap = new Map((blocks || []).map((b: any) => [b.block_id, b]));
        const totalDuration = body.blockIds.reduce((sum: number, bid: string) => {
          const block = blockMap.get(bid);
          return sum + (block?.duration_minutes || 0);
        }, 0);

        sessionUpdate.duration_minutes = totalDuration;
        sessionUpdate.description = `${body.blockIds.length} blocks · ${totalDuration} min`;
        sessionUpdate.notes = body.blockIds.map((bid: string, i: number) => {
          const block = blockMap.get(bid);
          return `${i + 1}. ${bid}: ${block?.name || 'Unknown'} (${block?.duration_minutes || '?'} min)`;
        }).join('\n');
      }

      await supabase
        .from('elite_training_sessions')
        .update(sessionUpdate)
        .eq('session_plan_id', planId);
    }

    return NextResponse.json({ success: true, plan: mapPlanRow(plan) });
  } catch (error) {
    console.error('Session plan update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
