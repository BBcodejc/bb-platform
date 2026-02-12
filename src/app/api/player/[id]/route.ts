import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET - Fetch dynamic player dashboard
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id: playerId } = params;

    // Get player data
    const { data: player, error: playerError } = await supabase
      .from('dynamic_players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Get today's context
    const { data: todayContext } = await supabase
      .from('dynamic_daily_context')
      .select('*')
      .eq('player_id', playerId)
      .eq('date', today)
      .single();

    // Get today's session if context exists
    let session = null;
    if (todayContext) {
      const { data: tasks } = await supabase
        .from('dynamic_daily_tasks')
        .select('*')
        .eq('player_id', playerId)
        .eq('date', today)
        .order('display_order', { ascending: true });

      const { data: focus } = await supabase
        .from('dynamic_daily_focus')
        .select('*')
        .eq('player_id', playerId)
        .eq('date', today)
        .single();

      if (tasks && focus) {
        session = {
          date: today,
          dayType: todayContext.day_type,
          focus: {
            id: focus.id,
            playerId: focus.player_id,
            date: focus.date,
            headline: focus.headline,
            subtext: focus.subtext,
            cues: focus.cues || [],
          },
          tasks: tasks.map(t => ({
            id: t.id,
            playerId: t.player_id,
            date: t.date,
            title: t.title,
            description: t.description,
            category: t.category,
            duration: t.duration,
            priority: t.priority,
            cues: t.cues || [],
            videoUrl: t.video_url,
            isCompleted: t.is_completed,
            completedAt: t.completed_at,
            feelRating: t.feel_rating,
            playerNotes: t.player_notes,
            displayOrder: t.display_order,
          })),
          estimatedDuration: tasks.reduce((sum, t) => sum + (t.duration || 0), 0),
        };
      }
    }

    // Get weekly progress
    const weekStart = getWeekStart(today);
    const { data: logs } = await supabase
      .from('dynamic_daily_logs')
      .select('*')
      .eq('player_id', playerId)
      .gte('date', weekStart)
      .lte('date', today);

    const weeklyProgress = logs ? {
      playerId,
      weekStart,
      weekEnd: today,
      daysLogged: logs.length,
      totalMinutes: logs.reduce((sum, log) => sum + (log.minutes_trained || 0), 0),
      tasksCompleted: logs.reduce((sum, log) => sum + (log.completed_task_ids?.length || 0), 0),
      tasksTotal: 0,
      adherenceStreak: calculateStreak(logs),
      avgFeelRating: logs.length > 0
        ? logs.reduce((sum, log) => sum + (log.overall_feel || 3), 0) / logs.length
        : 3,
      avgEnergyLevel: logs.length > 0
        ? logs.reduce((sum, log) => sum + (log.energy_level || 3), 0) / logs.length
        : 3,
      focusTrends: {},
    } : null;

    return NextResponse.json({
      player: {
        id: player.id,
        firstName: player.first_name,
        lastName: player.last_name,
        email: player.email,
        phone: player.phone,
        position: player.position,
        level: player.level,
        timezone: player.timezone,
        preferredSessionLength: player.preferred_session_length || 30,
        notificationsEnabled: player.notifications_enabled || false,
        adherenceStreak: player.adherence_streak || 0,
        totalMinutesTrained: player.total_minutes_trained || 0,
        isActive: player.is_active !== false,
        lastActiveAt: player.last_active_at,
      },
      todayContext: todayContext ? {
        id: todayContext.id,
        playerId: todayContext.player_id,
        date: todayContext.date,
        dayType: todayContext.day_type,
        timeAvailable: todayContext.time_available,
        environment: todayContext.environment,
        equipment: todayContext.equipment || [],
        isGameDay: todayContext.is_game_day,
      } : null,
      session,
      weeklyProgress,
    });
  } catch (error) {
    console.error('Dynamic player API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getWeekStart(date: string): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function calculateStreak(logs: any[]): number {
  if (!logs || logs.length === 0) return 0;
  const sortedLogs = [...logs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
      streak++;
      currentDate = logDate;
    } else {
      break;
    }
  }
  return streak;
}
