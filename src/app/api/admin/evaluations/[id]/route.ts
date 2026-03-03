import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const { id: prospectId } = await params;
    const supabase = createRouteHandlerClient(request);

    // Fetch shooting evaluation by prospect_id
    const { data: evaluation, error } = await supabase
      .from('shooting_evaluations')
      .select('*')
      .eq('prospect_id', prospectId)
      .single();

    if (error) {
      console.error('Error fetching evaluation:', error);
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 });
    }

    // Fetch prospect details
    const { data: prospect } = await supabase
      .from('prospects')
      .select('first_name, last_name, email, phone, high_ticket_prospect')
      .eq('id', prospectId)
      .single();

    return NextResponse.json({
      evaluation: {
        ...evaluation,
        prospects: prospect,
      },
    });
  } catch (error) {
    console.error('Admin evaluation detail error:', error);
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
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const { id: prospectId } = await params;
    const supabase = createRouteHandlerClient(request);
    const body = await request.json();

    const { error } = await supabase
      .from('shooting_evaluations')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('prospect_id', prospectId);

    if (error) {
      console.error('Error updating evaluation:', error);
      return NextResponse.json({ error: 'Failed to update evaluation' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin evaluation update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
