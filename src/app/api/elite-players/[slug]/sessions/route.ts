import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch sessions for a player (optional ?month=2&year=2025)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { slug } = params;

    // Get player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id, slug, first_name, last_name')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Parse query params for month filter
    const url = new URL(request.url);
    const month = url.searchParams.get('month');
    const year = url.searchParams.get('year');
    const isAdmin = url.searchParams.get('context') === 'admin';

    let query = supabase
      .from('elite_training_sessions')
      .select('*')
      .eq('player_id', player.id)
      .order('date', { ascending: false });

    // If month/year provided, filter to that month
    if (month && year) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const endYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
      query = query.gte('date', startDate).lt('date', endDate);
    } else {
      // Default: last 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      query = query.gte('date', ninetyDaysAgo.toISOString().split('T')[0]);
    }

    const { data: sessions, error: sessionsError } = await query;

    if (sessionsError) {
      console.error('Sessions fetch error:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    // Fetch daily notes for the same date range
    let dailyNotesQuery = supabase
      .from('elite_daily_notes')
      .select('*')
      .eq('player_id', player.id)
      .order('date', { ascending: false });

    if (month && year) {
      const dnStartDate = `${year}-${month.padStart(2, '0')}-01`;
      const dnEndMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const dnEndYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const dnEndDate = `${dnEndYear}-${String(dnEndMonth).padStart(2, '0')}-01`;
      dailyNotesQuery = dailyNotesQuery.gte('date', dnStartDate).lt('date', dnEndDate);
    } else {
      const ninetyDaysAgoNotes = new Date();
      ninetyDaysAgoNotes.setDate(ninetyDaysAgoNotes.getDate() - 90);
      dailyNotesQuery = dailyNotesQuery.gte('date', ninetyDaysAgoNotes.toISOString().split('T')[0]);
    }

    const { data: dailyNotes } = await dailyNotesQuery;

    return NextResponse.json({
      player: {
        id: player.id,
        slug: player.slug,
        firstName: player.first_name,
        lastName: player.last_name,
      },
      sessions: (sessions || []).map(s => ({
        id: s.id,
        playerId: s.player_id,
        date: s.date,
        sessionType: s.session_type,
        title: s.title,
        description: s.description,
        durationMinutes: s.duration_minutes,
        location: s.location,
        opponent: s.opponent,
        focusAreas: s.focus_areas || [],
        notes: s.notes,
        coachingNotes: isAdmin ? s.coaching_notes : (s.coaching_notes_visible ? s.coaching_notes : null),
        coachingNotesVisible: s.coaching_notes_visible ?? false,
        link: s.link,
        createdBy: s.created_by,
        createdAt: s.created_at,
      })),
      dailyNotes: (dailyNotes || [])
        .map(n => ({
          id: n.id,
          playerId: n.player_id,
          date: n.date,
          note: isAdmin ? n.note : (n.visible_to_player ? n.note : null),
          visibleToPlayer: n.visible_to_player ?? false,
          createdBy: n.created_by,
          createdAt: n.created_at,
          updatedAt: n.updated_at,
        }))
        .filter(n => isAdmin || n.note !== null),
    });
  } catch (error) {
    console.error('Sessions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new session
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { slug } = params;
    const body = await request.json();

    // Get player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const sessionData = {
      player_id: player.id,
      date: body.date,
      session_type: body.sessionType,
      title: body.title,
      description: body.description || null,
      duration_minutes: body.durationMinutes || null,
      location: body.location || null,
      opponent: body.opponent || null,
      focus_areas: body.focusAreas || [],
      notes: body.notes || null,
      coaching_notes: body.coachingNotes || null,
      coaching_notes_visible: body.coachingNotesVisible ?? false,
      link: body.link || null,
      created_by: body.createdBy || 'Coach Jake',
    };

    const { data: session, error: insertError } = await supabase
      .from('elite_training_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Session create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Upsert a daily coaching note for a specific date
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const { slug } = params;
    const body = await request.json();

    if (!body.date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Get player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // If note is empty, delete the daily note
    if (!body.note || !body.note.trim()) {
      await supabase
        .from('elite_daily_notes')
        .delete()
        .eq('player_id', player.id)
        .eq('date', body.date);

      return NextResponse.json({ success: true, deleted: true });
    }

    // Try update first, then insert if no row exists
    const noteData = {
      note: body.note.trim(),
      visible_to_player: body.visibleToPlayer ?? false,
      created_by: body.createdBy || 'Coach',
      updated_at: new Date().toISOString(),
    };

    // Check if a note already exists for this player+date
    const { data: existing } = await supabase
      .from('elite_daily_notes')
      .select('id')
      .eq('player_id', player.id)
      .eq('date', body.date)
      .maybeSingle();

    let dailyNote;
    let saveError;

    if (existing) {
      // Update existing note
      const { data, error } = await supabase
        .from('elite_daily_notes')
        .update(noteData)
        .eq('id', existing.id)
        .select()
        .single();
      dailyNote = data;
      saveError = error;
    } else {
      // Insert new note
      const { data, error } = await supabase
        .from('elite_daily_notes')
        .insert({
          player_id: player.id,
          date: body.date,
          ...noteData,
        })
        .select()
        .single();
      dailyNote = data;
      saveError = error;
    }

    if (saveError) {
      console.error('Daily note save error:', JSON.stringify(saveError));
      return NextResponse.json({ error: 'Failed to save daily note', details: saveError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, dailyNote });
  } catch (error) {
    console.error('Daily note API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
