import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/session-templates
 * Returns all active session templates, sorted by display_order.
 * Optional query param: ?category=shooting to filter by category.
 */
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('session_templates')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Error fetching session templates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch session templates' },
        { status: 500 }
      );
    }

    return NextResponse.json({ templates: templates || [] });
  } catch (error) {
    console.error('Session templates API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/session-templates
 * Create a new custom session template.
 */
export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const body = await request.json();

    const {
      name,
      slug,
      description,
      sessionType,
      category,
      icon,
      color,
      displayOrder,
      defaultTitle,
      defaultDescription,
      defaultDurationMinutes,
      defaultFocusAreas,
      defaultNotes,
      defaultCoachingNotes,
      requiredEquipment,
      environment,
      sessionCode,
      constraintLevel,
      phase,
      progressionNotes,
      regressionNotes,
    } = body;

    if (!name || !slug || !defaultTitle) {
      return NextResponse.json(
        { error: 'name, slug, and defaultTitle are required' },
        { status: 400 }
      );
    }

    const { data: template, error } = await supabase
      .from('session_templates')
      .insert({
        name,
        slug,
        description: description || null,
        session_type: sessionType || 'training',
        category: category || 'shooting',
        icon: icon || null,
        color: color || null,
        display_order: displayOrder || 0,
        default_title: defaultTitle,
        default_description: defaultDescription || null,
        default_duration_minutes: defaultDurationMinutes || null,
        default_focus_areas: defaultFocusAreas || [],
        default_notes: defaultNotes || null,
        default_coaching_notes: defaultCoachingNotes || null,
        required_equipment: requiredEquipment || [],
        environment: environment || ['court'],
        session_code: sessionCode || null,
        constraint_level: constraintLevel || null,
        phase: phase || null,
        progression_notes: progressionNotes || null,
        regression_notes: regressionNotes || null,
        created_by: 'admin',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session template:', error);
      return NextResponse.json(
        { error: 'Failed to create session template' },
        { status: 500 }
      );
    }

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Create session template error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
