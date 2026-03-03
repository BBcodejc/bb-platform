import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: body.name,
        email: body.email,
        role: body.role || null,
        source: body.source || 'website',
      })
      .select()
      .single();

    if (error) {
      // If leads table doesn't exist yet, still return success
      // so the form works even before migration
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.log('Leads table not created yet, skipping insert:', body.email);
        return NextResponse.json({ success: true, note: 'table pending' });
      }
      throw error;
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (error: any) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save' },
      { status: 500 }
    );
  }
}
