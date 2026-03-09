import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { mapTemplateRow } from '@/types/session-library';

export const dynamic = 'force-dynamic';

// GET - Fetch all session day templates
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();

    const { data: templates, error } = await supabase
      .from('session_day_templates')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Day templates fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }

    return NextResponse.json({
      templates: (templates || []).map(mapTemplateRow),
    });
  } catch (error) {
    console.error('Day templates API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
