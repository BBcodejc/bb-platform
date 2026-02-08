'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Settings2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Target,
  Zap,
  RotateCcw,
  Eye,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  type PlanKnobs,
  type DayScheduleItem,
  type StructuredSevenDayPlan,
  DEFAULT_KNOBS,
  DEFAULT_SCHEDULE,
  PLAN_PRESETS,
  generateStructuredPlan,
} from '@/lib/seven-day-plan';

interface PlanBuilderProps {
  plan: StructuredSevenDayPlan | null;
  onChange: (plan: StructuredSevenDayPlan) => void;
  bbLevel?: number;
}

export function PlanBuilder({ plan, onChange, bbLevel = 1 }: PlanBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showKnobs, setShowKnobs] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [knobs, setKnobs] = useState<PlanKnobs>(plan?.knobs || DEFAULT_KNOBS);
  const [schedule, setSchedule] = useState<DayScheduleItem[]>(plan?.schedule || DEFAULT_SCHEDULE);
  const [playerLogEnabled, setPlayerLogEnabled] = useState(plan?.playerPlanLogEnabled ?? true);
  const [selectedPreset, setSelectedPreset] = useState(plan?.presetId || 'lvl1-2-standard-v1');

  // Update plan when knobs, schedule, or logging changes
  useEffect(() => {
    const newPlan = generateStructuredPlan(knobs, schedule, playerLogEnabled);
    newPlan.presetId = selectedPreset;
    const preset = PLAN_PRESETS.find(p => p.id === selectedPreset);
    if (preset) {
      newPlan.presetName = preset.name;
    }
    onChange(newPlan);
  }, [knobs, schedule, playerLogEnabled, selectedPreset]);

  const handlePresetChange = (presetId: string) => {
    const preset = PLAN_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setKnobs(preset.knobs);
      setSchedule(preset.schedule);
    }
  };

  const handleKnobChange = (key: keyof PlanKnobs, value: any) => {
    setKnobs(prev => ({ ...prev, [key]: value }));
  };

  const handleScheduleChange = (day: number, session: 'A' | 'B' | 'C') => {
    setSchedule(prev =>
      prev.map(item => (item.day === day ? { ...item, session } : item))
    );
  };

  const resetToDefaults = () => {
    setKnobs(DEFAULT_KNOBS);
    setSchedule(DEFAULT_SCHEDULE);
    setSelectedPreset('lvl1-2-standard-v1');
  };

  const currentPlan = generateStructuredPlan(knobs, schedule, playerLogEnabled);

  // Only show for Level 1-2 players
  if (bbLevel > 2) {
    return (
      <Card className="bg-bb-card border-bb-border opacity-60">
        <CardContent className="p-4">
          <p className="text-sm text-gray-400">
            7-Day Implementation Plan is available for Level 1–2 players only.
            Level 3+ players receive custom protocols.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-bb-card border-bb-border">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-500" />
            7-Day Shooting Calibration Block
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Goal Banner */}
          <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded-lg">
            <p className="text-sm text-gold-500 font-medium">
              Goal: Build real shooting adaptability fast — not "perfect form."
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Training: distance control, back-rim command, and response after misses.
            </p>
          </div>

          {/* Non-Negotiable Rule */}
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-xs text-red-400 uppercase tracking-wider font-semibold mb-1">Non-Negotiable Rule</p>
            <p className="text-sm text-white">
              Back rim = good miss. Short misses are the enemy.
            </p>
          </div>

          {/* Preset Selection */}
          <div>
            <Select
              label="Plan Preset"
              options={PLAN_PRESETS.map(p => ({
                value: p.id,
                label: p.name,
              }))}
              value={selectedPreset}
              onChange={handlePresetChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              {PLAN_PRESETS.find(p => p.id === selectedPreset)?.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowKnobs(!showKnobs)}
              className="gap-2"
            >
              <Settings2 className="w-4 h-4" />
              {showKnobs ? 'Hide' : 'Adjust'} Reps
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSchedule(!showSchedule)}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              {showSchedule ? 'Hide' : 'Edit'} Schedule
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide' : 'Full'} Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="gap-2 text-gray-400"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Player Logging Toggle */}
          <div className="p-3 bg-bb-dark rounded-lg border border-bb-border">
            <Checkbox
              checked={playerLogEnabled}
              onChange={setPlayerLogEnabled}
              label="Enable Player Workout Logging"
              description="Players can track completion, 14-spot scores, deep distance line, and back rim streaks"
            />
          </div>

          {/* Schedule Editor */}
          {showSchedule && (
            <div className="p-4 bg-bb-dark rounded-lg border border-bb-border">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-500" />
                Weekly Schedule
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {schedule.map((item) => (
                  <div key={item.day} className="text-center">
                    <p className="text-xs text-gray-500 mb-2">Day {item.day}</p>
                    <select
                      value={item.session}
                      onChange={(e) => handleScheduleChange(item.day, e.target.value as 'A' | 'B' | 'C')}
                      className={cn(
                        'w-full px-2 py-2 rounded-lg text-sm font-bold text-center border-2 transition-colors cursor-pointer',
                        item.session === 'A' && 'bg-blue-500/20 border-blue-500 text-blue-400',
                        item.session === 'B' && 'bg-green-500/20 border-green-500 text-green-400',
                        item.session === 'C' && 'bg-purple-500/20 border-purple-500 text-purple-400'
                      )}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-500/30"></span>
                  A: Deep Distance (~95 shots)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-500/30"></span>
                  B: Ball Flight (~80 shots)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-purple-500/30"></span>
                  C: Fades (~80 shots)
                </span>
              </div>
            </div>
          )}

          {/* Knobs Editor */}
          {showKnobs && (
            <div className="space-y-6 p-4 bg-bb-dark rounded-lg border border-bb-border">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-gold-500" />
                Adjust Reps & Volume
              </h4>

              {/* Session A Settings */}
              <div className="space-y-4">
                <h5 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <Dumbbell className="w-3.5 h-3.5" />
                  Session A — Deep Distance + Back Rim
                </h5>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Deep Distance Reps (Block 1)</label>
                    <Input
                      type="number"
                      min={5}
                      max={20}
                      value={knobs.deepDistanceRepsPerBlock}
                      onChange={(e) => handleKnobChange('deepDistanceRepsPerBlock', parseInt(e.target.value) || 10)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Step-In Reps (each step)</label>
                    <Input
                      type="number"
                      min={5}
                      max={20}
                      value={knobs.deepDistanceStepInReps}
                      onChange={(e) => handleKnobChange('deepDistanceStepInReps', parseInt(e.target.value) || 10)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Pull-ups</label>
                    <Input
                      type="number"
                      min={3}
                      max={10}
                      value={knobs.offDribblePullUps}
                      onChange={(e) => handleKnobChange('offDribblePullUps', parseInt(e.target.value) || 5)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Step-backs</label>
                    <Input
                      type="number"
                      min={3}
                      max={10}
                      value={knobs.offDribbleStepBacks}
                      onChange={(e) => handleKnobChange('offDribbleStepBacks', parseInt(e.target.value) || 5)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Bounce Pull-ups</label>
                    <Input
                      type="number"
                      min={3}
                      max={10}
                      value={knobs.offDribbleBouncePullUps}
                      onChange={(e) => handleKnobChange('offDribbleBouncePullUps', parseInt(e.target.value) || 5)}
                    />
                  </div>
                </div>

                <Checkbox
                  checked={knobs.fourteenSpotTestOutEnabled}
                  onChange={(v) => handleKnobChange('fourteenSpotTestOutEnabled', v)}
                  label="Include 14-Spot Back Rim Test-Out"
                />
              </div>

              {/* Session B Settings */}
              <div className="space-y-4 pt-4 border-t border-bb-border">
                <h5 className="text-xs font-semibold text-green-400 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" />
                  Session B — Ball Flight Spectrum
                </h5>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Spots Per Angle</label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={knobs.ballFlightSpotsPerAngle}
                      onChange={(e) => handleKnobChange('ballFlightSpotsPerAngle', parseInt(e.target.value) || 2)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Reps Per Spot</label>
                    <Input
                      type="number"
                      min={5}
                      max={20}
                      value={knobs.ballFlightRepsPerSpot}
                      onChange={(e) => handleKnobChange('ballFlightRepsPerSpot', parseInt(e.target.value) || 10)}
                    />
                  </div>
                </div>

                <Checkbox
                  checked={knobs.ballFlightTestSeriesEnabled}
                  onChange={(v) => handleKnobChange('ballFlightTestSeriesEnabled', v)}
                  label="Include Ball Flight Test Series (14-Spot at each angle)"
                />
              </div>

              {/* Session C Settings */}
              <div className="space-y-4 pt-4 border-t border-bb-border">
                <h5 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Session C — Difficult Shooting + Fades
                </h5>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Fade Reps Per Direction</label>
                    <Input
                      type="number"
                      min={1}
                      max={3}
                      value={knobs.fadeRepsPerDirection}
                      onChange={(e) => handleKnobChange('fadeRepsPerDirection', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Start Steps Behind 3PT</label>
                    <Input
                      type="number"
                      min={2}
                      max={5}
                      value={knobs.deepFadeStartStepsBehind}
                      onChange={(e) => handleKnobChange('deepFadeStartStepsBehind', parseInt(e.target.value) || 3)}
                    />
                  </div>
                </div>

                <Checkbox
                  checked={knobs.offDribbleFadeEnabled}
                  onChange={(v) => handleKnobChange('offDribbleFadeEnabled', v)}
                  label="Include Off-the-Dribble Fades"
                />

                <Checkbox
                  checked={knobs.fadeTestOutEnabled}
                  onChange={(v) => handleKnobChange('fadeTestOutEnabled', v)}
                  label="Include 14-Spot Fade Test Out"
                />
              </div>
            </div>
          )}

          {/* Full Preview */}
          {showPreview && (
            <div className="space-y-4 p-4 bg-bb-dark rounded-lg border border-bb-border max-h-[600px] overflow-y-auto">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 sticky top-0 bg-bb-dark py-2">
                <Eye className="w-4 h-4 text-gold-500" />
                Full Plan Preview (What Player Sees)
              </h4>

              {/* Schedule Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-bb-border">
                      <th className="py-2 pr-4">Day</th>
                      <th className="py-2">Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPlan.schedule.map(({ day, session }) => (
                      <tr key={day} className="border-b border-bb-border/50">
                        <td className="py-2 pr-4 text-gold-500 font-bold">Day {day}</td>
                        <td className={cn(
                          'py-2',
                          session === 'A' && 'text-blue-400',
                          session === 'B' && 'text-green-400',
                          session === 'C' && 'text-purple-400'
                        )}>
                          Session {session} — {currentPlan.sessions[session].name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Session Details */}
              {(['A', 'B', 'C'] as const).map((sessionKey) => {
                const session = currentPlan.sessions[sessionKey];
                return (
                  <div
                    key={sessionKey}
                    className={cn(
                      'p-4 rounded-lg border',
                      sessionKey === 'A' && 'bg-blue-500/5 border-blue-500/20',
                      sessionKey === 'B' && 'bg-green-500/5 border-green-500/20',
                      sessionKey === 'C' && 'bg-purple-500/5 border-purple-500/20'
                    )}
                  >
                    <div className="mb-3">
                      <h5 className={cn(
                        'text-sm font-bold',
                        sessionKey === 'A' && 'text-blue-400',
                        sessionKey === 'B' && 'text-green-400',
                        sessionKey === 'C' && 'text-purple-400'
                      )}>
                        {session.fullName}
                      </h5>
                      <p className="text-xs text-gray-500">({session.days}) • {session.totalTime}</p>
                    </div>

                    <div className="p-2 bg-bb-dark/50 rounded mb-3">
                      <p className="text-xs text-gold-500 italic">Focus Rule: "{session.focusRule}"</p>
                    </div>

                    {session.parts.map((part, partIndex) => (
                      <div key={partIndex} className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-white">{part.title}</p>
                          <span className="text-xs text-gray-500">{part.time}</span>
                        </div>
                        <ul className="text-xs text-gray-300 space-y-1 pl-4">
                          {part.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="list-disc">
                              {step.instruction}
                              {step.reps && <span className="text-gold-500 font-semibold"> ({step.reps} reps{step.notes ? ` ${step.notes}` : ''})</span>}
                            </li>
                          ))}
                        </ul>
                        {part.totalShots && (
                          <p className="text-xs text-green-400 mt-1 pl-4">✓ Total: {part.totalShots} shots</p>
                        )}
                      </div>
                    ))}

                    <div className="pt-2 border-t border-bb-border/50">
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold">{session.totalVolume}</span> — {session.volumeNote}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3 p-3 bg-bb-dark/50 rounded-lg border border-bb-border">
            <div className="text-center">
              <p className="text-xl font-bold text-gold-500">7</p>
              <p className="text-xs text-gray-500">Days</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gold-500">3</p>
              <p className="text-xs text-gray-500">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gold-500">35-50</p>
              <p className="text-xs text-gray-500">Min/Day</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gold-500">~250</p>
              <p className="text-xs text-gray-500">Total Shots</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
