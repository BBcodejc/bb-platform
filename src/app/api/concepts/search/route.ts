import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, concepts: [] });
    }

    const searchTerm = `%${query}%`;

    const { data, error } = await supabase
      .from('concepts')
      .select('id, name, slug, short_description, difficulty_level, category_id, concept_categories(name, slug, color)')
      .eq('is_published', true)
      .or(`name.ilike.${searchTerm},definition.ilike.${searchTerm},short_description.ilike.${searchTerm}`)
      .order('display_order', { ascending: true })
      .limit(20);

    if (error) throw error;

    const concepts = (data || []).map((c: any) => ({
      ...c,
      category: c.concept_categories,
      concept_categories: undefined,
    }));

    return NextResponse.json({ success: true, concepts });
  } catch (error: any) {
    console.error('Error searching concepts:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Search failed' },
      { status: 500 }
    );
  }
}
