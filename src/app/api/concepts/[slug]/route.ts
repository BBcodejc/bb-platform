import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('concepts')
      .select('*, concept_categories(name, slug, icon, color), concept_videos(*)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Concept not found' }, { status: 404 });
    }

    const concept = {
      ...data,
      category: data.concept_categories,
      videos: (data.concept_videos || []).sort((a: any, b: any) => a.display_order - b.display_order),
      concept_categories: undefined,
      concept_videos: undefined,
    };

    return NextResponse.json({ success: true, concept });
  } catch (error: any) {
    console.error('Error fetching concept:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch concept' },
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
      .from('concepts')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, concept: data });
  } catch (error: any) {
    console.error('Error updating concept:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update concept' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const { slug } = await params;
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from('concepts')
      .delete()
      .eq('slug', slug);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting concept:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete concept' },
      { status: 500 }
    );
  }
}
