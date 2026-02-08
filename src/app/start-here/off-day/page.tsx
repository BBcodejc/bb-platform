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
    id: 'light-catch',
    name: 'Light Catch Work',
    duration: '2-3 min',
    description: 'Easy catches with minimal movement. Just feel the ball.',
    details: [
      'Partner passes from 10-12 feet',
      '10 catches: focus on hand position',
      '10 catches: add small weight shifts',
      'No shooting yet—just receiving',
    ],
    cue: 'Soft hands. Quiet feet. No rush.',
  },
  {
    id: 'rhythm-makes',
    name: 'Rhythm Makes',
    duration: '4-5 min',
    description: 'Low volume, high quality. Only shoot when you feel good.',
    details: [
      'Pick 3-5 spots you like',
      '2 makes per spot (not 2 shots—2 makes)',
      'If a spot feels off, move on',
      'Total: 6-10 makes',
    ],
    cue: 'Quality over quantity. Leave feeling good.',
  },
  {
    id: 'back-rim-check',
    name: 'Back-Rim Check',
    duration: '3-4 min',
    description: 'Quick calibration check without the full ladder.',
    details: [
      'Pick one comfortable spot',
      'Miss back rim once → make',
      'Miss back rim twice → make',
      'Done. That\'s it.',
    ],
    cue: 'Just checking the calibration—not rebuilding it.',
  },
  {
    id: 'flight-touch',
    name: 'Flight Touch',
    duration: '2-3 min',
    description: 'Light practice of different arcs. No pressure.',
    details: [
      'From one spot:',
      'Flat arc: 1 make',
      'Normal arc: 1 make',
      'High arc: 1 make',
      'If you miss, no stress—move on',
    ],
    cue: 'Reminder that you control the ball. Nothing more.',
  },
  {
    id: 'mini-test',
    name: 'Mini Test (Optional)',
    duration: '2-3 min',
    description: 'If you have energy, run a quick 7-spot test.',
    details: [
      '7 spots around the arc',
      '1 shot per spot',
      'Goal: back rim or make',
      'Track your score (out of 7)',
    ],
    cue: 'Optional. Only if you want data today.',
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
              <p className="text-gray-400">10-18 minutes • Maintenance Session</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            <strong className="text-green-400">Goal:</strong> Maintain + sharpen without fatigue. Keep your calibration sharp.
          </p>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-300 text-sm">
              <strong>Remember:</strong> Off days are for touch, not rebuilding. If something feels off, note it and address it on Practice Day.
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
            const isOptional = drill.id === 'mini-test';

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
