import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const { slug } = await params;
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('coaching_clients')
      .select('*, week0_assessments(*)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, client: data });
  } catch (error: any) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const { slug } = await params;
    const supabase = createServiceRoleClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('coaching_clients')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, client: data });
  } catch (error: any) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update client' },
      { status: 500 }
    );
  }
}
