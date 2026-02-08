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
  Zap,
  Target,
  RotateCcw,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
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
    id: 'catch-variety',
    name: 'Catch Variety + Hops',
    duration: '3-4 min',
    description: 'Have a partner pass different heights while you add movement.',
    details: [
      'High pass x 6 reps',
      'Middle pass x 6 reps',
      'Low pass x 6 reps',
      'On each catch: hop (left, right, forward, or back)',
    ],
    cue: 'Get the ball to the back rim. No mechanical thoughts.',
  },
  {
    id: 'back-rim-ladder',
    name: 'Back-Rim Response Ladder',
    duration: '6-8 min',
    description: 'From one spot you like, practice intentional misses then makes.',
    details: [
      'Miss back rim once → make next',
      'Miss back rim twice → make next',
      'Miss back rim three times → make next',
      'Record: How long did it take?',
    ],
    cue: 'This is distance control + composure training.',
  },
  {
    id: 'ball-flight',
    name: 'Ball Flight Spectrum',
    duration: '4-5 min',
    description: 'From 2-3 spots, practice different arcs on command.',
    details: [
      'Flat arc: make 1',
      'Normal arc: make 1',
      'High arc: make 1',
    ],
    cue: 'Same target. Different flight.',
  },
  {
    id: 'test-out',
    name: 'Quick "Test Out"',
    duration: '2-3 min',
    description: 'Mini assessment to close the session.',
    details: [
      '7 spots OR 14 spots (if time)',
      'Back rim or make is the goal, not perfection',
    ],
    cue: 'Leave the gym feeling: "effortless."',
  },
];

export default function GameDayPage() {
  const [completedDrills, setCompletedDrills] = useState<Set<string>>(new Set());
  const [expandedDrill, setExpandedDrill] = useState<string | null>(drills[0].id);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

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
                  className="h-full bg-gold-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-gold-500/10 to-bb-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <Zap className="w-7 h-7 text-gold-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Game Day Protocol</h1>
              <p className="text-gray-400">15-20 minutes • Shootaround / Pre-game</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            <strong className="text-gold-500">Goal:</strong> Make the game feel slower by making warm-up more demanding.
          </p>
        </div>
      </section>

      {/* Timer (optional) */}
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

            return (
              <Card
                key={drill.id}
                className={`transition-all duration-200 ${isCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-bb-card border-bb-border'}`}
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
                          <Circle className="w-6 h-6 text-gray-500 hover:text-gold-500 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 text-sm font-bold">
                            {index + 1}
                          </span>
                          <h3 className={`text-lg font-semibold ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                            {drill.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-bb-dark text-gray-400 text-xs">
                            {drill.duration}
                          </span>
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
                                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0" />
                                <span className="text-gray-300 text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded-lg">
                          <p className="text-xs text-gold-500 uppercase tracking-wider mb-1">Cue</p>
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
      {completedDrills.size === drills.length && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
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
          <p className="text-gray-500 text-sm mb-4">When you&apos;re ready for more:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/start-here/practice-day" className="flex-1">
              <Card variant="glass" hover className="p-5 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Practice Day</p>
                    <p className="text-gray-500 text-sm">25-35 min • Build the system</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/start-here/off-day" className="flex-1">
              <Card variant="glass" hover className="p-5 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Off Day</p>
                    <p className="text-gray-500 text-sm">10-18 min • Maintain + sharpen</p>
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
