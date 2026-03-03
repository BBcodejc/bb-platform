import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  try {
    const { clientSlug } = await params;
    const supabase = createServerSupabaseClient();

    // Find client by slug
    const { data: client, error: clientError } = await supabase
      .from('coaching_clients')
      .select('id, first_name, last_name, slug')
      .eq('slug', clientSlug)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Get their assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('week0_assessments')
      .select('*')
      .eq('client_id', client.id)
      .single();

    if (assessmentError && assessmentError.code !== 'PGRST116') {
      throw assessmentError;
    }

    return NextResponse.json({
      success: true,
      client,
      assessment: assessment || null,
    });
  } catch (error: any) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch assessment' },
      { status: 500 }
    );
  }
}
