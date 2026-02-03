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
  Activity,
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

interface Block {
  id: string;
  name: string;
  duration: string;
  color: string;
  drills: DrillStep[];
}

const blocks: Block[] = [
  {
    id: 'block-a',
    name: 'Block A: Deep Distance Calibration',
    duration: '8-10 min',
    color: 'blue',
    drills: [
      {
        id: 'battle-distance',
        name: 'Find Your Battle Distance',
        duration: '3-4 min',
        description: 'Find the deepest spot you can reach the rim without panic.',
        details: [
          '10 reps: back rim or make',
          'Keep stepping back until your body starts to compensate',
          'That point = your Battle Distance',
        ],
        cue: 'Where does your body start to fight the distance?',
      },
      {
        id: 'distance-ladder',
        name: 'Distance Ladder',
        duration: '4-5 min',
        description: 'Build force production with controlled distance changes.',
        details: [
          'Step back 1 step from Battle Distance: 10 reps',
          'Step forward 2 steps: 10 reps',
          'Finish: 5 makes from the regular 3-point line',
        ],
        cue: 'The game doesn\'t give you one distance.',
      },
    ],
  },
  {
    id: 'block-b',
    name: 'Block B: Miss → Fix',
    duration: '8-10 min',
    color: 'purple',
    drills: [
      {
        id: 'miss-fix-1',
        name: 'Miss Response: Spot 1',
        duration: '2-3 min',
        description: 'From your first preferred spot, practice reading and fixing misses.',
        details: [
          'Miss back rim once → make next',
          'Miss back rim twice → make next',
          'Miss back rim three times → make next',
        ],
        cue: 'Read the miss. Get the ball back to the target.',
      },
      {
        id: 'miss-fix-2',
        name: 'Miss Response: Spot 2',
        duration: '2-3 min',
        description: 'Move to a different spot. Repeat the miss → fix cycle.',
        details: [
          'Miss back rim once → make next',
          'Miss back rim twice → make next',
          'Miss back rim three times → make next',
        ],
        cue: 'Same skill, different context.',
      },
      {
        id: 'miss-fix-3',
        name: 'Miss Response: Spot 3',
        duration: '2-3 min',
        description: 'Third spot. Complete the cycle.',
        details: [
          'Miss back rim once → make next',
          'Miss back rim twice → make next',
          'Miss back rim three times → make next',
        ],
        cue: 'Composure is a skill you train.',
      },
    ],
  },
  {
    id: 'block-c',
    name: 'Block C: Speed + Flight Combo',
    duration: '8-12 min',
    color: 'green',
    drills: [
      {
        id: 'speed-variation',
        name: 'Speed Variation',
        duration: '4-5 min',
        description: 'Practice shooting at different speeds from the same spot.',
        details: [
          'Fast tempo: 3 makes',
          'Normal tempo: 3 makes',
          'Slow tempo: 3 makes',
          'Random mix: 6 reps (call out speed before each shot)',
        ],
        cue: 'The game doesn\'t give you one tempo.',
      },
      {
        id: 'flight-variation',
        name: 'Ball Flight Variation',
        duration: '4-5 min',
        description: 'From 2-3 spots, practice hitting different arcs on command.',
        details: [
          'Flat arc: 2 makes',
          'Normal arc: 2 makes',
          'High arc: 2 makes',
          'Random mix: 6 reps (call out flight before each shot)',
        ],
        cue: 'Same target. Different flight. You control the ball.',
      },
      {
        id: 'combo-challenge',
        name: 'Speed + Flight Combo',
        duration: '3-4 min',
        description: 'Combine speed and flight variations.',
        details: [
          'Fast + Flat: 2 reps',
          'Slow + High: 2 reps',
          'Normal + Normal: 2 reps',
          'Random combo: 6 reps',
        ],
        cue: 'Bandwidth = how many solutions you can produce.',
      },
    ],
  },
];

export default function PracticeDayPage() {
  const [completedDrills, setCompletedDrills] = useState<Set<string>>(new Set());
  const [expandedDrill, setExpandedDrill] = useState<string | null>(blocks[0].drills[0].id);
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

  const totalDrills = blocks.reduce((acc, block) => acc + block.drills.length, 0);
  const progress = (completedDrills.size / totalDrills) * 100;

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
              <Link href="/protocols" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-sm font-medium text-white">{completedDrills.size}/{totalDrills} drills</p>
              </div>
              <div className="w-24 h-2 bg-bb-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-blue-500/10 to-bb-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Practice Day Protocol</h1>
              <p className="text-gray-400">25-35 minutes • Full Training Session</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            <strong className="text-blue-400">Goal:</strong> Build the system. Expand bandwidth with speed, flight, distance, and miss response.
          </p>
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

      {/* Blocks */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {blocks.map((block) => {
            const blockCompleted = block.drills.every((drill) => completedDrills.has(drill.id));
            const blockProgress = block.drills.filter((drill) => completedDrills.has(drill.id)).length;

            return (
              <div key={block.id}>
                {/* Block Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      block.color === 'blue' ? 'bg-blue-500' :
                      block.color === 'purple' ? 'bg-purple-500' :
                      'bg-green-500'
                    }`} />
                    <h2 className="text-xl font-bold text-white">{block.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-bb-card text-gray-400 text-xs">
                      {block.duration}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {blockProgress}/{block.drills.length}
                  </span>
                </div>

                {/* Block Drills */}
                <div className="space-y-3">
                  {block.drills.map((drill, drillIndex) => {
                    const isCompleted = completedDrills.has(drill.id);
                    const isExpanded = expandedDrill === drill.id;

                    return (
                      <Card
                        key={drill.id}
                        className={`transition-all duration-200 ${
                          isCompleted
                            ? 'bg-green-500/10 border-green-500/30'
                            : `bg-bb-card border-bb-border`
                        }`}
                      >
                        <CardContent className="p-0">
                          {/* Drill Header */}
                          <div
                            className="p-4 cursor-pointer"
                            onClick={() => setExpandedDrill(isExpanded ? null : drill.id)}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDrillComplete(drill.id);
                                }}
                                className="mt-0.5 shrink-0"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Circle className={`w-5 h-5 text-gray-500 hover:text-${block.color}-400 transition-colors`} />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h3 className={`font-medium ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                                    {drill.name}
                                  </h3>
                                  <span className="px-1.5 py-0.5 rounded bg-bb-dark text-gray-500 text-xs">
                                    {drill.duration}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-sm">{drill.description}</p>
                              </div>

                              <div className="shrink-0">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Drill Details (Expanded) */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-0 border-t border-bb-border ml-8">
                              <div className="pt-3 space-y-3">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Steps</p>
                                  <ul className="space-y-1.5">
                                    {drill.details.map((detail, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                          block.color === 'blue' ? 'bg-blue-500' :
                                          block.color === 'purple' ? 'bg-purple-500' :
                                          'bg-green-500'
                                        }`} />
                                        <span className="text-gray-300 text-sm">{detail}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className={`p-3 rounded-lg border ${
                                  block.color === 'blue'
                                    ? 'bg-blue-500/10 border-blue-500/30'
                                    : block.color === 'purple'
                                    ? 'bg-purple-500/10 border-purple-500/30'
                                    : 'bg-green-500/10 border-green-500/30'
                                }`}>
                                  <p className={`text-xs uppercase tracking-wider mb-1 ${
                                    block.color === 'blue' ? 'text-blue-400' :
                                    block.color === 'purple' ? 'text-purple-400' :
                                    'text-green-400'
                                  }`}>Cue</p>
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
              </div>
            );
          })}
        </div>
      </section>

      {/* Session Complete */}
      {completedDrills.size === totalDrills && (
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
                  <Link href="/protocols/tracking">
                    <Button size="lg">
                      Log Your Results
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/protocols">
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
            <Link href="/protocols/game-day" className="flex-1">
              <Card variant="glass" hover className="p-5 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center text-gold-500">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Game Day</p>
                    <p className="text-gray-500 text-sm">15-20 min • Calibrate fast</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/protocols/off-day" className="flex-1">
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
