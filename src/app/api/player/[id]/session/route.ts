import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { BBDecisionEngine, createDecisionContext } from '@/lib/bb-engine/decision-engine';

export const dynamic = 'force-dynamic';

// POST - Generate daily session for dynamic player
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceRoleClient();
    const { id: playerId } = params;
    const body = await request.json();
    const { dailyContext: inputContext } = body;

    // Get player
    const { data: player, error: playerError } = await supabase
      .from('dynamic_players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    // Save daily context
    const contextData = {
      player_id: playerId,
      date: today,
      day_type: inputContext.dayType || 'practice-day',
      time_available: inputContext.timeAvailable || 30,
      environment: inputContext.environment || 'court',
      equipment: inputContext.equipment || [],
      is_game_day: inputContext.dayType === 'game-day',
      created_at: now,
    };

    await supabase.from('dynamic_daily_context').upsert(contextData, {
      onConflict: 'player_id,date',
    });

    // Create decision context for engine
    const bbPlayer = {
      id: player.id,
      slug: player.id,
      firstName: player.first_name,
      lastName: player.last_name,
      email: player.email,
      position: player.position || '',
      level: player.level || 'recreational',
      seasonStatus: 'in-season' as const,
      isActive: true,
    };

    const dailyContext = {
      id: `ctx-${today}-${playerId}`,
      playerId,
      date: today,
      dayType: inputContext.dayType || 'practice-day',
      timeAvailable: inputContext.timeAvailable || 30,
      environment: inputContext.environment || 'court',
      equipment: inputContext.equipment || [],
      isGameDay: inputContext.dayType === 'game-day',
    };

    // Default coach settings
    const coachSettings = {
      playerId,
      activeThemes: ['shooting', 'movement'],
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

    // Generate session using decision engine
    const context = createDecisionContext(
      bbPlayer as any,
      dailyContext as any,
      { playerId, weekStart: today, weekEnd: today, entries: [] },
      [],
      coachSettings as any,
      []
    );

    const engine = new BBDecisionEngine(context);
    const generatedSession = engine.generateSession();

    // Save focus
    await supabase.from('dynamic_daily_focus').upsert({
      player_id: playerId,
      date: today,
      headline: generatedSession.todaysFocus.headline,
      subtext: generatedSession.todaysFocus.subtext,
      cues: generatedSession.todaysFocus.cues,
      created_at: now,
    }, {
      onConflict: 'player_id,date',
    });

    // Save tasks
    await supabase.from('dynamic_daily_tasks').delete()
      .eq('player_id', playerId)
      .eq('date', today);

    if (generatedSession.tasks.length > 0) {
      const tasksToInsert = generatedSession.tasks.map(task => ({
        id: task.id,
        player_id: playerId,
        date: today,
        title: task.title,
        description: task.description,
        category: task.category,
        duration: task.duration,
        priority: task.priority,
        cues: task.cues,
        video_url: task.videoUrl,
        is_completed: false,
        display_order: task.displayOrder,
        created_at: now,
      }));
      await supabase.from('dynamic_daily_tasks').insert(tasksToInsert);
    }

    // Update player last active
    await supabase.from('dynamic_players').update({
      last_active_at: now,
    }).eq('id', playerId);

    // Return session
    return NextResponse.json({
      session: {
        date: today,
        dayType: dailyContext.dayType,
        focus: {
          id: `focus-${today}`,
          playerId,
          date: today,
          headline: generatedSession.todaysFocus.headline,
          subtext: generatedSession.todaysFocus.subtext,
          cues: generatedSession.todaysFocus.cues,
        },
        tasks: generatedSession.tasks,
        estimatedDuration: generatedSession.estimatedDuration,
      },
      dailyContext,
    });
  } catch (error) {
    console.error('Session generation error:', error);
    return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 });
  }
}
