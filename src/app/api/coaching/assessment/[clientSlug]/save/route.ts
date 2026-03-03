import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const { clientSlug } = await params;
    const supabase = createRouteHandlerClient(request);
    const body = await request.json();

    // Find client by slug
    const { data: client } = await supabase
      .from('coaching_clients')
      .select('id')
      .eq('slug', clientSlug)
      .single();

    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    // Build update object from form sections
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.current_step) updateData.current_step = body.current_step;
    if (body.player_info !== undefined) updateData.player_info = body.player_info;
    if (body.fourteen_spot !== undefined) updateData.fourteen_spot = body.fourteen_spot;
    if (body.deep_distance !== undefined) updateData.deep_distance = body.deep_distance;
    if (body.back_rim !== undefined) updateData.back_rim = body.back_rim;
    if (body.ball_flight !== undefined) updateData.ball_flight = body.ball_flight;
    if (body.fades !== undefined) updateData.fades = body.fades;
    if (body.oversize_ball !== undefined) updateData.oversize_ball = body.oversize_ball;
    if (body.live_video !== undefined) updateData.live_video = body.live_video;
    if (body.vertical_jump !== undefined) updateData.vertical_jump = body.vertical_jump;
    if (body.movement_patterns !== undefined) updateData.movement_patterns = body.movement_patterns;

    // Upsert: update if exists, insert if not
    const { data: existing } = await supabase
      .from('week0_assessments')
      .select('id')
      .eq('client_id', client.id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('week0_assessments')
        .update(updateData)
        .eq('client_id', client.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('week0_assessments')
        .insert({
          client_id: client.id,
          status: 'in_progress',
          ...updateData,
        });
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving assessment:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save' },
      { status: 500 }
    );
  }
}
