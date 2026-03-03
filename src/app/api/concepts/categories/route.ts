import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient, createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data: categories, error } = await supabase
      .from('concept_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    // Get concept counts per category
    const { data: counts } = await supabase
      .from('concepts')
      .select('category_id')
      .eq('is_published', true);

    const countMap: Record<string, number> = {};
    (counts || []).forEach((c: any) => {
      countMap[c.category_id] = (countMap[c.category_id] || 0) + 1;
    });

    const enriched = (categories || []).map((cat: any) => ({
      ...cat,
      conceptCount: countMap[cat.id] || 0,
    }));

    return NextResponse.json({ success: true, categories: enriched });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createRouteHandlerClient(request);
    const body = await request.json();

    const { data, error } = await supabase
      .from('concept_categories')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        display_order: body.display_order || 0,
        icon: body.icon || null,
        color: body.color || null,
        parent_id: body.parent_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, category: data });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
