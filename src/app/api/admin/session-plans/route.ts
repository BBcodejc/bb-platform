import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { mapPlanRow } from '@/types/session-library';

export const dynamic = 'force-dynamic';

// GET - List session plans for a player in a given month
// ?playerId=xxx&month=3&year=2026
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const url = new URL(request.url);
    const playerId = url.searchParams.get('playerId');
    const month = url.searchParams.get('month');
    const year = url.searchParams.get('year');

    if (!playerId) {
      return NextResponse.json({ error: 'playerId is required' }, { status: 400 });
    }

    let query = supabase
      .from('session_plans')
      .select('*')
      .eq('player_id', playerId)
      .order('session_date', { ascending: false });

    if (month && year) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const endYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
      query = query.gte('session_date', startDate).lt('session_date', endDate);
    }

    const { data: plans, error } = await query;

    if (error) {
      console.error('Session plans fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
    }

    return NextResponse.json({
      plans: (plans || []).map(mapPlanRow),
    });
  } catch (error) {
    console.error('Session plans API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new session plan (also creates linked elite_training_session)
export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const body = await request.json();

    const { playerId, date, templateId, templateName, blockIds, blockNotes, coachingNotes, createdBy } = body;

    if (!playerId || !date || !blockIds || blockIds.length === 0) {
      return NextResponse.json({ error: 'playerId, date, and blockIds are required' }, { status: 400 });
    }

    // Fetch block details to compute duration and focus areas
    const { data: blocks } = await supabase
      .from('session_blocks')
      .select('block_id, name, duration_minutes, category')
      .in('block_id', blockIds);

    const blockMap = new Map((blocks || []).map(b => [b.block_id, b]));
    const totalDuration = blockIds.reduce((sum: number, bid: string) => {
      const block = blockMap.get(bid);
      return sum + (block?.duration_minutes || 0);
    }, 0);

    // Derive focus areas from block categories
    const categories = Array.from(new Set((blocks || []).map(b => b.category)));
    const focusAreas = categories.map(c => {
      const map: Record<string, string> = {
        shooting: 'Shooting',
        movement: 'Movement',
        ball_manipulation: 'Ball Handling',
        live_play: 'Live Play',
        evaluation: 'Evaluation',
      };
      return map[c] || c;
    });

    // Generate notes summary from block names
    const blockSummary = blockIds.map((bid: string, i: number) => {
      const block = blockMap.get(bid);
      return `${i + 1}. ${bid}: ${block?.name || 'Unknown'} (${block?.duration_minutes || '?'} min)`;
    }).join('\n');

    // 1. Create session_plans record
    const { data: plan, error: planError } = await supabase
      .from('session_plans')
      .insert({
        player_id: playerId,
        session_date: date,
        template_id: templateId || null,
        template_name: templateName || null,
        block_ids: blockIds,
        block_notes: blockNotes || {},
        coaching_notes: coachingNotes || null,
        total_duration_minutes: totalDuration,
        created_by: createdBy || 'admin',
      })
      .select()
      .single();

    if (planError) {
      console.error('Session plan insert error:', planError);
      return NextResponse.json({ error: 'Failed to create session plan' }, { status: 500 });
    }

    // 2. Create linked elite_training_sessions record (shows on calendar)
    const sessionTitle = templateName || 'Training Session';
    const { data: session, error: sessionError } = await supabase
      .from('elite_training_sessions')
      .insert({
        player_id: playerId,
        date,
        session_type: 'training',
        title: sessionTitle,
        description: `${blockIds.length} blocks · ${totalDuration} min`,
        duration_minutes: totalDuration,
        focus_areas: focusAreas,
        notes: blockSummary,
        coaching_notes: coachingNotes || null,
        coaching_notes_visible: !!coachingNotes,
        session_plan_id: plan.id,
        created_by: createdBy || 'admin',
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Training session insert error:', sessionError);
      // Rollback: delete the plan if session creation failed
      await supabase.from('session_plans').delete().eq('id', plan.id);
      return NextResponse.json({ error: 'Failed to create training session' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      plan: mapPlanRow(plan),
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Session plan create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
