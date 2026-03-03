import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServerSupabaseClient();
    const prospectId = params.id;

    // Fetch prospect
    const { data: prospect, error: prospectError } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single();

    if (prospectError) {
      console.error('Error fetching prospect:', prospectError);
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    // Fetch payments
    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('created_at', { ascending: false });

    // Fetch evaluation if exists
    const { data: evaluation } = await supabase
      .from('evaluations')
      .select('*')
      .eq('prospect_id', prospectId)
      .single();

    // Fetch shooting evaluation if exists
    const { data: shootingEvaluation } = await supabase
      .from('shooting_evaluations')
      .select('*')
      .eq('prospect_id', prospectId)
      .single();

    return NextResponse.json({
      prospect,
      payments: payments || [],
      evaluation,
      shootingEvaluation,
    });
  } catch (error) {
    console.error('Admin prospect detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServerSupabaseClient();
    const prospectId = params.id;
    const body = await request.json();

    const { error } = await supabase
      .from('prospects')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', prospectId);

    if (error) {
      console.error('Error updating prospect:', error);
      return NextResponse.json({ error: 'Failed to update prospect' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin prospect update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
