import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { verifyEliteRequest } from '@/lib/elite-auth';

export const dynamic = 'force-dynamic';

// GET - Fetch sessions for an elite player (token or admin auth)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { player, isAdmin } = await verifyEliteRequest(request, slug);

    if (!player) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const url = new URL(request.url);
    const month = url.searchParams.get('month');
    const year = url.searchParams.get('year');

    let query = supabase
      .from('elite_training_sessions')
      .select('*')
      .eq('player_id', player.id)
      .order('date', { ascending: false });

    if (month && year) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const endYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
      query = query.gte('date', startDate).lt('date', endDate);
    } else {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      query = query.gte('date', ninetyDaysAgo.toISOString().split('T')[0]);
    }

    const { data: sessions, error: sessionsError } = await query;

    if (sessionsError) {
      console.error('Sessions fetch error:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    // Fetch daily notes
    let dailyNotesQuery = supabase
      .from('elite_daily_notes')
      .select('*')
      .eq('player_id', player.id)
      .order('date', { ascending: false });

    if (month && year) {
      const dnStart = `${year}-${month.padStart(2, '0')}-01`;
      const dnEndMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const dnEndYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const dnEnd = `${dnEndYear}-${String(dnEndMonth).padStart(2, '0')}-01`;
      dailyNotesQuery = dailyNotesQuery.gte('date', dnStart).lt('date', dnEnd);
    } else {
      const nda = new Date();
      nda.setDate(nda.getDate() - 90);
      dailyNotesQuery = dailyNotesQuery.gte('date', nda.toISOString().split('T')[0]);
    }

    const { data: dailyNotes } = await dailyNotesQuery;

    return NextResponse.json({
      player: {
        id: player.id,
        slug: player.slug,
        firstName: player.firstName,
        lastName: player.lastName,
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
        videoUrl: s.video_url,
        videoUrlClient: s.video_url_client,
        bestTestOfDay: s.best_test_of_day,
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
    console.error('Elite sessions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
