'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Target,
  Calendar,
  Clock,
  MapPin,
  Dumbbell,
  Play,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  Brain,
  Activity,
  Home,
  Car,
  User,
  Trophy,
  TrendingUp,
  AlertCircle,
  Loader2,
  Settings,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type {
  DayType,
  Environment,
  Equipment,
  DailyContext,
  GeneratedSession,
  BBPlayer,
  WeeklyProgress,
} from '@/types/bb-player-system';

// ============================================
// DAY TYPE OPTIONS
// ============================================

const DAY_TYPES: { value: DayType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'game-day',
    label: 'Game Day',
    icon: <Trophy className="w-6 h-6" />,
    description: 'Competition today',
  },
  {
    value: 'practice-day',
    label: 'Practice Day',
    icon: <Dumbbell className="w-6 h-6" />,
    description: 'Team practice scheduled',
  },
  {
    value: 'off-day',
    label: 'Off Day',
    icon: <Home className="w-6 h-6" />,
    description: 'Recovery & individual work',
  },
  {
    value: 'travel-day',
    label: 'Travel Day',
    icon: <Car className="w-6 h-6" />,
    description: 'On the road',
  },
];

const TIME_OPTIONS = [15, 30, 45, 60, 90, 120];

const ENVIRONMENT_OPTIONS: { value: Environment; label: string; icon: React.ReactNode }[] = [
  { value: 'court', label: 'Full Court', icon: <Target className="w-5 h-5" /> },
  { value: 'weight-room', label: 'Weight Room', icon: <Dumbbell className="w-5 h-5" /> },
  { value: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { value: 'no-hoop', label: 'No Hoop', icon: <MapPin className="w-5 h-5" /> },
  { value: 'outdoor', label: 'Outdoor', icon: <Activity className="w-5 h-5" /> },
];

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'rebounder', label: 'Rebounder' },
  { value: 'passer', label: 'Passer' },
  { value: 'defender', label: 'Defender Pad' },
  { value: 'blockers', label: 'Shot Blockers' },
  { value: 'strobes', label: 'Strobe Glasses' },
  { value: 'aqua-vest', label: 'Aqua Vest' },
  { value: 'oversize-ball', label: 'Oversize Ball' },
  { value: 'resistance-bands', label: 'Resistance Bands' },
  { value: 'foam-roller', label: 'Foam Roller' },
  { value: 'none', label: 'None' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function BBPlayerPortal() {
  const params = useParams();
  const slug = params.slug as string;

  // State
  const [player, setPlayer] = useState<BBPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Daily setup state
  const [setupStep, setSetupStep] = useState<'day-type' | 'time' | 'environment' | 'equipment' | 'complete'>('day-type');
  const [dailyContext, setDailyContext] = useState<Partial<DailyContext>>({
    date: new Date().toISOString().split('T')[0],
    equipment: [],
  });

  // Generated session
  const [session, setSession] = useState<GeneratedSession | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Weekly progress
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null);

  // Sections open/closed
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    focus: true,
    tasks: true,
    cues: true,
    progress: false,
  });

  // Fetch player data
  useEffect(() => {
    async function fetchPlayer() {
      try {
        const res = await fetch(`/api/bb-portal/${slug}`);
        if (!res.ok) throw new Error('Failed to load player');
        const data = await res.json();
        setPlayer(data.player);

        // Check if player has already completed setup today
        if (data.todayContext) {
          setDailyContext(data.todayContext);
          setSetupStep('complete');
          setSession(data.session);
        }

        if (data.weeklyProgress) {
          setWeeklyProgress(data.weeklyProgress);
        }
      } catch (err) {
        setError('Unable to load your dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchPlayer();
  }, [slug]);

  // Handle daily setup completion
  const handleSetupComplete = async () => {
    if (!player) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/bb-portal/${slug}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyContext }),
      });

      if (!res.ok) throw new Error('Failed to generate session');

      const data = await res.json();
      setSession(data.session);
      setSetupStep('complete');
    } catch (err) {
      setError('Unable to generate your session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const toggleTaskComplete = async (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);

    // Save to server (non-blocking)
    fetch(`/api/bb-portal/${slug}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: newCompleted.has(taskId) }),
    }).catch(err => console.error('Failed to save task completion:', err));
  };

  // Toggle section
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Loading state
  if (loading && !player) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !player) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Unable to Load</h2>
          <p className="text-gray-400">{error || 'Dashboard not found'}</p>
        </div>
      </div>
    );
  }

  // Daily Setup Flow
  if (setupStep !== 'complete') {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        {/* Header */}
        <header className="border-b border-[#1A1A1A] bg-[#0D0D0D]/95 backdrop-blur-lg">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/players/bb-logo.png"
                alt="BB"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-white font-semibold">BB Player System</h1>
                <p className="text-gray-500 text-sm">{player.firstName} {player.lastName}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {['day-type', 'time', 'environment', 'equipment'].map((step, i) => (
              <div
                key={step}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  setupStep === step ? 'bg-gold-500 w-8' :
                    ['day-type', 'time', 'environment', 'equipment'].indexOf(setupStep) > i
                      ? 'bg-gold-500/50' : 'bg-gray-700'
                )}
              />
            ))}
          </div>

          {/* Step 1: Day Type */}
          {setupStep === 'day-type' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">What kind of day is it?</h2>
                <p className="text-gray-400">We'll customize your session accordingly</p>
              </div>

              <div className="grid gap-4">
                {DAY_TYPES.map(dayType => (
                  <button
                    key={dayType.value}
                    onClick={() => {
                      setDailyContext(prev => ({ ...prev, dayType: dayType.value }));
                      setSetupStep('time');
                    }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                      'hover:border-gold-500/50 hover:bg-gold-500/5',
                      'border-[#2A2A2A] bg-[#1A1A1A]'
                    )}
                  >
                    <div className="p-3 rounded-lg bg-gold-500/20 text-gold-500">
                      {dayType.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{dayType.label}</p>
                      <p className="text-sm text-gray-400">{dayType.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Time Available */}
          {setupStep === 'time' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">How much time do you have?</h2>
                <p className="text-gray-400">We'll build a session that fits</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {TIME_OPTIONS.map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => {
                      setDailyContext(prev => ({ ...prev, timeAvailable: minutes as any }));
                      setSetupStep('environment');
                    }}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all',
                      'hover:border-gold-500/50 hover:bg-gold-500/5',
                      'border-[#2A2A2A] bg-[#1A1A1A]'
                    )}
                  >
                    <p className="text-2xl font-bold text-white">{minutes}</p>
                    <p className="text-sm text-gray-400">min</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSetupStep('day-type')}
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Step 3: Environment */}
          {setupStep === 'environment' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Where are you training?</h2>
                <p className="text-gray-400">This determines what exercises are available</p>
              </div>

              <div className="grid gap-3">
                {ENVIRONMENT_OPTIONS.map(env => (
                  <button
                    key={env.value}
                    onClick={() => {
                      setDailyContext(prev => ({ ...prev, environment: env.value }));
                      setSetupStep('equipment');
                    }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                      'hover:border-gold-500/50 hover:bg-gold-500/5',
                      'border-[#2A2A2A] bg-[#1A1A1A]'
                    )}
                  >
                    <div className="p-2 rounded-lg bg-[#2A2A2A] text-gray-400">
                      {env.icon}
                    </div>
                    <span className="font-medium text-white">{env.label}</span>
                    <ChevronRight className="w-5 h-5 text-gray-500 ml-auto" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSetupStep('time')}
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Step 4: Equipment */}
          {setupStep === 'equipment' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">What equipment do you have?</h2>
                <p className="text-gray-400">Select all that apply</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {EQUIPMENT_OPTIONS.map(equip => (
                  <button
                    key={equip.value}
                    onClick={() => {
                      setDailyContext(prev => {
                        const current = prev.equipment || [];
                        if (equip.value === 'none') {
                          return { ...prev, equipment: ['none'] };
                        }
                        const filtered = current.filter(e => e !== 'none');
                        if (filtered.includes(equip.value)) {
                          return { ...prev, equipment: filtered.filter(e => e !== equip.value) };
                        }
                        return { ...prev, equipment: [...filtered, equip.value] };
                      });
                    }}
                    className={cn(
                      'p-3 rounded-xl border-2 transition-all text-left',
                      dailyContext.equipment?.includes(equip.value)
                        ? 'border-gold-500 bg-gold-500/10'
                        : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-gold-500/50'
                    )}
                  >
                    <span className={cn(
                      'font-medium',
                      dailyContext.equipment?.includes(equip.value) ? 'text-gold-500' : 'text-white'
                    )}>
                      {equip.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSetupStep('environment')}
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <Button
                  onClick={handleSetupComplete}
                  disabled={loading}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Building Session...
                    </>
                  ) : (
                    <>
                      Generate My Session
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Dashboard (after setup)
  const tasksCompleted = session?.tasks.filter(t => completedTasks.has(t.id)).length || 0;
  const totalTasks = session?.tasks.length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1A1A1A] bg-[#0D0D0D]/95 backdrop-blur-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {player.headshotUrl ? (
                <img
                  src={player.headshotUrl}
                  alt={`${player.firstName} ${player.lastName}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold-500/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-gold-500" />
                </div>
              )}
              <div>
                <h1 className="text-white font-semibold">{player.firstName} {player.lastName}</h1>
                <p className="text-gray-500 text-sm capitalize">
                  {dailyContext.dayType?.replace('-', ' ')} • {dailyContext.timeAvailable} min
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSetupStep('day-type')}
              className="text-gray-400"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Progress Ring */}
        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#141414] border-[#2A2A2A]">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    className="fill-none stroke-[#2A2A2A]"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    className="fill-none stroke-gold-500"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercent * 2.2} 220`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{progressPercent}%</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Today's Progress</h3>
                <p className="text-gray-400 text-sm mb-2">
                  {tasksCompleted} of {totalTasks} tasks completed
                </p>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-400">
                    {weeklyProgress?.adherenceStreak || 0} day streak
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Focus */}
        {session?.todaysFocus && (
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] overflow-hidden">
            <button
              onClick={() => toggleSection('focus')}
              className="w-full"
            >
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold-500/20">
                    <Target className="w-5 h-5 text-gold-500" />
                  </div>
                  <div className="text-left">
                    <CardTitle className="text-base text-white">
                      {session.todaysFocus.headline}
                    </CardTitle>
                    {session.todaysFocus.subtext && (
                      <p className="text-sm text-gray-400">{session.todaysFocus.subtext}</p>
                    )}
                  </div>
                </div>
                {openSections.focus ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </CardHeader>
            </button>

            {openSections.focus && (
              <CardContent className="px-4 pb-4 pt-0">
                <div className="space-y-2">
                  {session.todaysFocus.cues.map((cue, i) => (
                    <div
                      key={cue.id || i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#0D0D0D]"
                    >
                      <div className="mt-0.5">
                        <Zap className="w-4 h-4 text-gold-500" />
                      </div>
                      <p className="text-sm text-gray-300">{cue.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Tasks */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <button
            onClick={() => toggleSection('tasks')}
            className="w-full"
          >
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-base text-white">Today's Tasks</CardTitle>
                  <p className="text-sm text-gray-400">
                    {session?.estimatedDuration || 0} min • {totalTasks} exercises
                  </p>
                </div>
              </div>
              {openSections.tasks ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </CardHeader>
          </button>

          {openSections.tasks && session?.tasks && (
            <CardContent className="px-4 pb-4 pt-0 space-y-2">
              {session.tasks.map((task, i) => (
                <button
                  key={task.id}
                  onClick={() => toggleTaskComplete(task.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left',
                    completedTasks.has(task.id)
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-[#0D0D0D] border-[#2A2A2A] hover:border-gold-500/30'
                  )}
                >
                  <div className="mt-0.5">
                    {completedTasks.has(task.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn(
                        'font-medium',
                        completedTasks.has(task.id) ? 'text-green-400 line-through' : 'text-white'
                      )}>
                        {task.title}
                      </p>
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-[#2A2A2A] rounded">
                        {task.duration} min
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                    {!completedTasks.has(task.id) && task.cues && (
                      <div className="flex flex-wrap gap-1">
                        {task.cues.slice(0, 2).map((cue, j) => (
                          <span
                            key={j}
                            className="text-xs text-gold-500/80 bg-gold-500/10 px-2 py-0.5 rounded"
                          >
                            {cue}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Weekly Progress */}
        {weeklyProgress && (
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <button
              onClick={() => toggleSection('progress')}
              className="w-full"
            >
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <CardTitle className="text-base text-white">Weekly Progress</CardTitle>
                    <p className="text-sm text-gray-400">
                      {weeklyProgress.daysLogged} days • {weeklyProgress.totalMinutes} min
                    </p>
                  </div>
                </div>
                {openSections.progress ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </CardHeader>
            </button>

            {openSections.progress && (
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-[#0D0D0D] text-center">
                    <p className="text-2xl font-bold text-white">{weeklyProgress.tasksCompleted}</p>
                    <p className="text-xs text-gray-400">Tasks Done</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D0D0D] text-center">
                    <p className="text-2xl font-bold text-white">{weeklyProgress.adherenceStreak}</p>
                    <p className="text-xs text-gray-400">Day Streak</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D0D0D] text-center">
                    <p className="text-2xl font-bold text-white">{weeklyProgress.avgFeelRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-400">Avg Feel</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
