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
      .select('id, first_name, last_name, email')
      .eq('slug', clientSlug)
      .single();

    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    // Save all assessment data and mark as submitted
    const { error } = await supabase
      .from('week0_assessments')
      .update({
        status: 'submitted',
        current_step: 'review',
        player_info: body.player_info || {},
        fourteen_spot: body.fourteen_spot || {},
        deep_distance: body.deep_distance || {},
        back_rim: body.back_rim || {},
        ball_flight: body.ball_flight || {},
        fades: body.fades || {},
        oversize_ball: body.oversize_ball || {},
        live_video: body.live_video || {},
        vertical_jump: body.vertical_jump || {},
        movement_patterns: body.movement_patterns || {},
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('client_id', client.id);

    if (error) throw error;

    // Update client onboarding status
    await supabase
      .from('coaching_clients')
      .update({
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', client.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit assessment' },
      { status: 500 }
    );
  }
}
