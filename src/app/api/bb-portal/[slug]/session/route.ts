import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import {
  BBDecisionEngine,
  createDecisionContext,
} from '@/lib/bb-engine/decision-engine';
import type {
  DailyContext,
  BBPlayer,
  WeeklySchedule,
  LimitingFactor,
  CoachSettings,
  DailyLog,
} from '@/types/bb-player-system';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServiceRoleClient();
    const { slug } = params;
    const body = await request.json();
    const { dailyContext: inputContext } = body;

    // Get player
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

    // Transform to BBPlayer
    const bbPlayer: BBPlayer = {
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
      level: 'elite',
      seasonStatus: player.season_status || 'in-season',
      isActive: player.is_active !== false,
    };

    // Create full daily context
    const today = new Date().toISOString().split('T')[0];
    const dailyContext: DailyContext = {
      id: `ctx-${today}-${player.id}`,
      playerId: player.id,
      date: today,
      dayType: inputContext.dayType || 'practice-day',
      timeAvailable: inputContext.timeAvailable || 30,
      environment: inputContext.environment || 'court',
      equipment: inputContext.equipment || [],
      isGameDay: inputContext.dayType === 'game-day',
    };

    // Save daily context to database
    const { error: contextError } = await supabase
      .from('player_daily_context')
      .upsert({
        player_id: player.id,
        date: today,
        day_type: dailyContext.dayType,
        time_available: dailyContext.timeAvailable,
        environment: dailyContext.environment,
        equipment: dailyContext.equipment,
        is_game_day: dailyContext.isGameDay,
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'player_id,date',
      });

    if (contextError) {
      console.error('Error saving context:', contextError);
    }

    // Get limiting factors
    const { data: limitingFactorsData } = await supabase
      .from('elite_limiting_factors')
      .select('*')
      .eq('player_id', player.id)
      .eq('is_active', true);

    const limitingFactors: LimitingFactor[] = (limitingFactorsData || []).map(lf => ({
      id: lf.id,
      playerId: lf.player_id,
      name: lf.name,
      shortDescription: lf.short_description,
      severity: lf.severity || 'medium',
      priority: lf.priority || 1,
      awarenessCue: lf.awareness_cue,
      isActive: lf.is_active,
      isAddressed: lf.is_addressed || false,
    }));

    // Default coach settings (can be loaded from DB later)
    const coachSettings: CoachSettings = {
      playerId: player.id,
      activeThemes: ['shooting', 'calibration'],
      enabledModules: {
        shooting: true,
        movement: true,
        ballHandling: true,
        vision: true,
        recovery: true,
        mental: true,
        livePlay: true,
        film: true,
      },
    };

    // Get recent logs
    const weekStart = getWeekStart(today);
    const { data: logsData } = await supabase
      .from('player_daily_logs')
      .select('*')
      .eq('player_id', player.id)
      .gte('date', weekStart);

    const recentLogs: DailyLog[] = (logsData || []).map(log => ({
      id: log.id,
      playerId: log.player_id,
      date: log.date,
      minutesTrained: log.minutes_trained || 0,
      overallFeel: log.overall_feel || 3,
      energyLevel: log.energy_level,
      focusLevel: log.focus_level,
      notes: log.notes,
      completedTaskIds: log.completed_task_ids || [],
    }));

    // Empty weekly schedule for now
    const weeklySchedule: WeeklySchedule = {
      playerId: player.id,
      weekStart,
      weekEnd: today,
      entries: [],
    };

    // Create decision context
    const context = createDecisionContext(
      bbPlayer,
      dailyContext,
      weeklySchedule,
      limitingFactors,
      coachSettings,
      recentLogs
    );

    // Generate session
    const engine = new BBDecisionEngine(context);
    const session = engine.generateSession();

    // Save generated tasks to database
    for (const task of session.tasks) {
      await supabase
        .from('player_daily_tasks')
        .upsert({
          id: task.id,
          player_id: player.id,
          date: today,
          title: task.title,
          description: task.description,
          category: task.category,
          duration: task.duration,
          priority: task.priority,
          cues: task.cues,
          is_completed: false,
          display_order: task.displayOrder,
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });
    }

    return NextResponse.json({
      session,
      dailyContext,
    });
  } catch (error) {
    console.error('Session generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate session' },
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
