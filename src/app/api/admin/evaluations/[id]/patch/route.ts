import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const { id: evaluationId } = await params;
    const body = await request.json();

    const supabase = createServerSupabaseClient();

    // Update the evaluation with the provided data
    const { data, error } = await supabase
      .from('shooting_evaluations')
      .update(body)
      .eq('id', evaluationId)
      .select()
      .single();

    if (error) {
      console.error('Patch evaluation error:', error);
      return NextResponse.json(
        { error: 'Failed to update evaluation', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Patch API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
