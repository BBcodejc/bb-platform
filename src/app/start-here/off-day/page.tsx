'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Circle,
  Sun,
  Target,
  RotateCcw,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
} from 'lucide-react';

interface DrillStep {
  id: string;
  name: string;
  duration: string;
  description: string;
  details: string[];
  cue: string;
}

const drills: DrillStep[] = [
  {
    id: 'deep-distance-ladder',
    name: 'Deep Distance Ladder Progression',
    duration: '~15 min',
    description: 'Find your deep distance line and work the ladder from deepest range inward. Back rim control at every distance.',
    details: [
      'Start at your deepest comfortable 3-point range — where you can still reach back rim without compensating',
      '10 reps from deepest spot: back rim or make only',
      'Step in 1 step: 10 reps, same standard (back rim or make)',
      'Step in 1 more step: 10 reps',
      'Continue stepping in until you reach the regular 3-point line',
      'At each distance, if you\'re missing front rim or short — hold that spot until you get 3 consecutive back rim or makes before moving in',
      'Finish with 5 clean makes from the regular 3-point line',
    ],
    cue: 'Control the distance. Don\'t let the distance control you.',
  },
  {
    id: 'step-backs-bounds',
    name: 'Step Backs & Bounds Off the Handle',
    duration: '5-8 min',
    description: 'Off-dribble work from deep distance range. Step-backs and bound pull-ups to build game-speed calibration.',
    details: [
      'Start at your deep distance line (same range as Drill 1)',
      'Step-back jumpers: 5 from the left wing, 5 from the right wing, 5 from the top',
      'Bound pull-ups (1-2 dribble, bound into shot): 5 from each of the same 3 spots',
      'Standard: back rim or make — if you\'re missing short, you\'re rushing',
      'Total: ~30 shots off the dribble',
    ],
    cue: 'Same back rim target. The dribble doesn\'t change the standard.',
  },
  {
    id: 'test-out-1',
    name: 'Test Out',
    duration: '3-5 min',
    description: '14-spot test around the arc. 1 shot per spot. Back rim or make is a pass.',
    details: [
      'Start at the right corner',
      'Move around the arc: 14 evenly spaced spots from corner to corner',
      '1 shot per spot — no second chances',
      'Score: back rim or make = pass, everything else = miss',
      'Track your score out of 14',
      'Goal: 10+ passes out of 14',
    ],
    cue: 'This is a snapshot. No emotion — just data.',
  },
  {
    id: 'back-rim-miss-make',
    name: 'Back Rim Miss → Intentional Make',
    duration: '5-7 min',
    description: 'From multiple spots: intentionally miss back rim once, then make the very next shot. Trains calibration and control.',
    details: [
      'Pick 5 spots around the arc',
      'At each spot: intentionally hit back rim (miss) on shot 1',
      'Immediately follow with an intentional make on shot 2',
      'The miss must be a true back-rim miss — not a wild miss, not front rim',
      'If your "intentional miss" goes in, repeat until you get a clean back-rim miss',
      'If you can\'t make shot 2 after the miss, stay at that spot until you complete the sequence',
      'Total: 5 spots × 2 shots = ~10-15 shots',
    ],
    cue: 'You should be able to miss where you want AND make when you want.',
  },
  {
    id: 'double-back-rim-miss-make',
    name: '2 Back Rim Misses → Intentional Make',
    duration: '5-8 min',
    description: 'Harder version: intentionally miss back rim twice in a row, then make the next shot. Builds precision under constraint.',
    details: [
      'Pick 5 spots around the arc (same or different spots as Drill 4)',
      'At each spot: intentionally hit back rim on shot 1 AND shot 2',
      'Shot 3: intentional make',
      'Both misses must be clean back-rim — if either is front rim or air, restart the sequence at that spot',
      'If the make doesn\'t go in on shot 3, restart the full 3-shot sequence at that spot',
      'This is hard. Stay patient. The point is control, not speed.',
      'Total: 5 spots × 3 shots = ~15-25 shots',
    ],
    cue: 'Two controlled misses then a make. That\'s elite calibration.',
  },
  {
    id: 'test-out-step-backs',
    name: 'Test Out: Step Backs Only',
    duration: '3-5 min',
    description: '14-spot test out but every shot is off a step-back move. Game-speed calibration check.',
    details: [
      'Same 14 spots around the arc as Drill 3',
      'At each spot: 1-2 dribble setup into a step-back jumper',
      '1 shot per spot — no second chances',
      'Score: back rim or make = pass, everything else = miss',
      'Track your score out of 14',
      'Compare to your regular test out score from Drill 3',
    ],
    cue: 'If the gap between this and your regular test out is big, that\'s your next training target.',
  },
  {
    id: 'test-out-final',
    name: 'Test Out: Regular (Final)',
    duration: '3-5 min',
    description: 'Standard 14-spot test out to close the session. See where you are after the full workout.',
    details: [
      'Same 14 spots around the arc',
      '1 shot per spot — catch and shoot, no dribble',
      'Score: back rim or make = pass',
      'Track your score out of 14',
      'Compare to your Drill 3 score: did you improve, hold steady, or drop?',
      'This final score is your session snapshot — log it',
    ],
    cue: 'Finish clean. This score tells you where you are today.',
  },
];

export default function OffDayPage() {
  const [completedDrills, setCompletedDrills] = useState<Set<string>>(new Set());
  const [expandedDrill, setExpandedDrill] = useState<string | null>(drills[0].id);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const toggleDrillComplete = (drillId: string) => {
    const newCompleted = new Set(completedDrills);
    if (newCompleted.has(drillId)) {
      newCompleted.delete(drillId);
    } else {
      newCompleted.add(drillId);
    }
    setCompletedDrills(newCompleted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (completedDrills.size / drills.length) * 100;

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-bb-dark/95 backdrop-blur-lg border-b border-bb-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/players/bb-logo.png"
                  alt="BB"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </Link>
              <Link href="/start-here" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-sm font-medium text-white">{completedDrills.size}/{drills.length} drills</p>
              </div>
              <div className="w-24 h-2 bg-bb-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-green-500/10 to-bb-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Sun className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Off Day Protocol</h1>
              <p className="text-gray-400">35-50 minutes • Deep Calibration Session</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            <strong className="text-green-400">Goal:</strong> Deep distance work, off-dribble calibration, and precision control. Push your range and sharpen your command.
          </p>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-300 text-sm">
              <strong>Remember:</strong> This is a full calibration session. Work through every drill with intent. Track your test-out scores — they tell you where your game is today.
            </p>
          </div>
        </div>
      </section>

      {/* Timer */}
      <section className="py-4 bg-bb-dark border-y border-bb-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-2xl font-mono text-white">{formatTime(timerSeconds)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTimerActive(!timerActive)}
              >
                {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {timerActive ? 'Pause' : 'Start'} Timer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTimerSeconds(0)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Drills */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {drills.map((drill, index) => {
            const isCompleted = completedDrills.has(drill.id);
            const isExpanded = expandedDrill === drill.id;
            const isOptional = false;

            return (
              <Card
                key={drill.id}
                className={`transition-all duration-200 ${
                  isCompleted
                    ? 'bg-green-500/10 border-green-500/30'
                    : isOptional
                    ? 'bg-bb-card/50 border-bb-border border-dashed'
                    : 'bg-bb-card border-bb-border'
                }`}
              >
                <CardContent className="p-0">
                  {/* Drill Header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedDrill(isExpanded ? null : drill.id)}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDrillComplete(drill.id);
                        }}
                        className="mt-1 shrink-0"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-500 hover:text-green-400 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm font-bold">
                            {index + 1}
                          </span>
                          <h3 className={`text-lg font-semibold ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                            {drill.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-bb-dark text-gray-400 text-xs">
                            {drill.duration}
                          </span>
                          {isOptional && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 text-xs">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{drill.description}</p>
                      </div>

                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Drill Details (Expanded) */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 border-t border-bb-border ml-10">
                      <div className="pt-4 space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Steps</p>
                          <ul className="space-y-2">
                            {drill.details.map((detail, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                <span className="text-gray-300 text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Cue</p>
                          <p className="text-white text-sm font-medium">{drill.cue}</p>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => toggleDrillComplete(drill.id)}
                          className={isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Target className="w-4 h-4 mr-2" />
                              Mark Complete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Session Complete */}
      {completedDrills.size >= drills.length - 1 && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {completedDrills.size === drills.length ? 'Full Session Complete!' : 'Core Session Complete!'}
                </h2>
                <p className="text-gray-400 mb-6">
                  Total time: {formatTime(timerSeconds)}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/start-here/tracking">
                    <Button size="lg">
                      Log Your Results
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/start-here">
                    <Button variant="secondary" size="lg">
                      Back to Sessions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Next Session Suggestion */}
      <section className="py-12 bg-bb-dark">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gray-500 text-sm mb-4">Other sessions:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/start-here/game-day" className="flex-1">
              <Card variant="glass" hover className="p-5 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center text-gold-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Game Day</p>
                    <p className="text-gray-500 text-sm">15-20 min • Calibrate fast</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/start-here/practice-day" className="flex-1">
              <Card variant="glass" hover className="p-5 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Practice Day</p>
                    <p className="text-gray-500 text-sm">25-35 min • Build the system</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
