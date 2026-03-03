import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function slugify(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('coaching_clients')
      .select('*, week0_assessments(id, status, submitted_at)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, clients: data });
  } catch (error: any) {
    console.error('Error fetching coaching clients:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const slug = body.slug || slugify(body.first_name, body.last_name);

    const { data, error } = await supabase
      .from('coaching_clients')
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email || null,
        phone: body.phone || null,
        position: body.position || null,
        level: body.level || 'high-school',
        team: body.team || null,
        age: body.age ? Number(body.age) : null,
        slug,
        coach_assigned: body.coach_assigned || null,
        program_type: body.program_type || 'standard',
        prospect_id: body.prospect_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Create empty Week 0 assessment for the client
    await supabase.from('week0_assessments').insert({
      client_id: data.id,
      status: 'in_progress',
    });

    return NextResponse.json({ success: true, client: data });
  } catch (error: any) {
    console.error('Error creating coaching client:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create client' },
      { status: 500 }
    );
  }
}
