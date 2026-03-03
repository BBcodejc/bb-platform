import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    // Viewing unpublished concepts requires admin
    if (published === 'all') {
      const { error: authError } = await requireAdmin(request);
      if (authError) return authError;
    }

    const supabase = createServerSupabaseClient();
    const category = searchParams.get('category');

    let query = supabase
      .from('concepts')
      .select('*, concept_categories(name, slug, icon, color), concept_videos(id)')
      .order('display_order', { ascending: true });

    if (category) {
      const { data: cat } = await supabase
        .from('concept_categories')
        .select('id')
        .eq('slug', category)
        .single();
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    if (published !== 'all') {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform to include video count
    const concepts = (data || []).map((c: any) => ({
      ...c,
      category: c.concept_categories,
      videoCount: c.concept_videos?.length || 0,
      concept_categories: undefined,
      concept_videos: undefined,
    }));

    return NextResponse.json({ success: true, concepts });
  } catch (error: any) {
    console.error('Error fetching concepts:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch concepts' },
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

    const { data, error } = await supabase
      .from('concepts')
      .insert({
        category_id: body.category_id,
        name: body.name,
        slug: body.slug,
        definition: body.definition,
        short_description: body.short_description || null,
        execution_cues: body.execution_cues || [],
        progression_notes: body.progression_notes || null,
        common_mistakes: body.common_mistakes || [],
        difficulty_level: body.difficulty_level || null,
        is_published: body.is_published ?? false,
        display_order: body.display_order || 0,
        tags: body.tags || [],
        created_by: body.created_by || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, concept: data });
  } catch (error: any) {
    console.error('Error creating concept:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create concept' },
      { status: 500 }
    );
  }
}
