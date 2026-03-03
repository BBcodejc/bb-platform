import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createRouteHandlerClient(request);

    const { data: sequences, error } = await supabase
      .from('email_sequences')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Error fetching email sequences:', error);
      return NextResponse.json({ error: 'Failed to fetch sequences' }, { status: 500 });
    }

    return NextResponse.json({ sequences: sequences || [] });
  } catch (error) {
    console.error('Email sequences API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
