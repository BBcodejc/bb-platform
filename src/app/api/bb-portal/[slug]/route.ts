import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServiceRoleClient();
    const { slug } = params;

    // Get player data
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('*')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Transform to BBPlayer format
    const bbPlayer = {
      id: player.id,
      slug: player.slug,
      firstName: player.name?.split(' ')[0] || '',
      lastName: player.name?.split(' ').slice(1).join(' ') || '',
      email: player.email,
      phone: player.phone,
      position: player.position || '',
      team: player.team || '',
      teamLogo: player.team_logo,
      headshotUrl: player.photo_url,
      level: 'elite' as const,
      seasonStatus: player.season_status || 'in-season',
      isActive: player.is_active !== false,
    };

    // Check for today's context
    const today = new Date().toISOString().split('T')[0];
    const { data: todayContext } = await supabase
      .from('player_daily_context')
      .select('*')
      .eq('player_id', player.id)
      .eq('date', today)
      .single();

    // Get weekly progress
    const weekStart = getWeekStart(today);
    const { data: logs } = await supabase
      .from('player_daily_logs')
      .select('*')
      .eq('player_id', player.id)
      .gte('date', weekStart)
      .lte('date', today);

    const weeklyProgress = logs ? {
      playerId: player.id,
      weekStart,
      weekEnd: today,
      daysLogged: logs.length,
      totalMinutes: logs.reduce((sum, log) => sum + (log.minutes_trained || 0), 0),
      tasksCompleted: logs.reduce((sum, log) => sum + (log.completed_task_count || 0), 0),
      tasksTotal: logs.reduce((sum, log) => sum + (log.total_task_count || 0), 0),
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
      player: bbPlayer,
      todayContext: todayContext ? {
        ...todayContext,
        equipment: todayContext.equipment || [],
      } : null,
      weeklyProgress,
    });
  } catch (error) {
    console.error('Portal API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    const diffDays = Math.floor(
      (currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 1) {
      streak++;
      currentDate = logDate;
    } else {
      break;
    }
  }

  return streak;
}
