'use client';

import { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Target,
  Dumbbell,
  Zap,
  ClipboardList,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  type StructuredSevenDayPlan,
  type DayLog,
  type SessionDefinition,
  getSessionForDay,
  getSessionLetterForDay,
} from '@/lib/seven-day-plan';

interface SevenDayPlanViewProps {
  plan: StructuredSevenDayPlan;
  logs?: DayLog[];
  onLogUpdate?: (logs: DayLog[]) => void;
  readOnly?: boolean;
}

export function SevenDayPlanView({
  plan,
  logs = [],
  onLogUpdate,
  readOnly = false,
}: SevenDayPlanViewProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [localLogs, setLocalLogs] = useState<DayLog[]>(
    logs.length > 0
      ? logs
      : Array.from({ length: 7 }, (_, i) => ({
          day: i + 1,
          completed: false,
          notes: '',
        }))
  );

  const handleLogChange = (day: number, updates: Partial<DayLog>) => {
    const newLogs = localLogs.map((log) =>
      log.day === day
        ? { ...log, ...updates, completedAt: updates.completed ? new Date().toISOString() : log.completedAt }
        : log
    );
    setLocalLogs(newLogs);
    onLogUpdate?.(newLogs);
  };

  const getLogForDay = (day: number): DayLog => {
    return localLogs.find((l) => l.day === day) || { day, completed: false, notes: '' };
  };

  const completedCount = localLogs.filter((l) => l.completed).length;

  const getSessionColor = (session: 'A' | 'B' | 'C' | null) => {
    switch (session) {
      case 'A':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: Dumbbell };
      case 'B':
        return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: Target };
      case 'C':
        return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: Zap };
      default:
        return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', icon: Circle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold-500" />
          <h3 className="text-lg font-semibold text-white">BB 7-Day Shooting Calibration</h3>
        </div>
        {plan.playerPlanLogEnabled && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">{completedCount}/7</span>
            <div className="w-16 h-2 bg-bb-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 transition-all"
                style={{ width: `${(completedCount / 7) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Goal */}
      <div className="p-4 bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-500/30 rounded-lg">
        <p className="text-sm text-gold-500 font-medium mb-1">Goal</p>
        <p className="text-sm text-gray-300">{plan.goal}</p>
      </div>

      {/* Non-Negotiable Rule */}
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <p className="text-xs text-red-400 uppercase tracking-wider font-semibold">Non-Negotiable Rule</p>
        </div>
        <p className="text-sm text-white font-medium">{plan.nonNegotiableRule}</p>
      </div>

      {/* Schedule Overview */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Weekly Schedule</p>
        <div className="grid grid-cols-7 gap-2">
          {plan.schedule.map(({ day, session }) => {
            const log = getLogForDay(day);
            const colors = getSessionColor(session);
            const sessionDef = plan.sessions[session];

            return (
              <button
                key={day}
                onClick={() => setExpandedDay(expandedDay === day ? null : day)}
                className={cn(
                  'p-3 rounded-lg text-center border transition-all',
                  colors.bg,
                  colors.border,
                  expandedDay === day && 'ring-2 ring-gold-500'
                )}
              >
                <p className="text-xs text-gray-500">Day {day}</p>
                <p className={cn('text-lg font-bold', colors.text)}>{session}</p>
                {plan.playerPlanLogEnabled && (
                  <div className="mt-1">
                    {log.completed ? (
                      <CheckCircle2 className="w-4 h-4 mx-auto text-green-400" />
                    ) : (
                      <Circle className="w-4 h-4 mx-auto text-gray-600" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Dumbbell className="w-3 h-3 text-blue-400" />
          A: Deep Distance (~95 shots)
        </span>
        <span className="flex items-center gap-1">
          <Target className="w-3 h-3 text-green-400" />
          B: Ball Flight (~80 shots)
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-purple-400" />
          C: Fades (~80 shots)
        </span>
      </div>

      {/* Expanded Day Details */}
      {expandedDay !== null && (
        <DayDetail
          day={expandedDay}
          plan={plan}
          log={getLogForDay(expandedDay)}
          onLogChange={(updates) => handleLogChange(expandedDay, updates)}
          readOnly={readOnly || !plan.playerPlanLogEnabled}
        />
      )}
    </div>
  );
}

interface DayDetailProps {
  day: number;
  plan: StructuredSevenDayPlan;
  log: DayLog;
  onLogChange: (updates: Partial<DayLog>) => void;
  readOnly: boolean;
}

function DayDetail({ day, plan, log, onLogChange, readOnly }: DayDetailProps) {
  const session = getSessionForDay(plan, day);
  const sessionLetter = getSessionLetterForDay(plan, day);

  const getSessionColor = (s: 'A' | 'B' | 'C' | null) => {
    switch (s) {
      case 'A':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: Dumbbell };
      case 'B':
        return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: Target };
      case 'C':
        return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: Zap };
      default:
        return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', icon: Circle };
    }
  };

  const colors = getSessionColor(sessionLetter);
  const IconComponent = colors.icon;

  if (!session) return null;

  return (
    <div className={cn('rounded-lg border overflow-hidden', colors.border)}>
      {/* Session Header */}
      <div className={cn('p-4', colors.bg)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <IconComponent className={cn('w-6 h-6', colors.text)} />
            <div>
              <h4 className={cn('font-bold text-lg', colors.text)}>
                Day {day} — Session {sessionLetter}
              </h4>
              <p className="text-sm text-gray-400">{session.name}</p>
            </div>
          </div>
          {!readOnly && (
            <Checkbox
              checked={log.completed}
              onChange={(checked) => onLogChange({ completed: checked })}
              label="Done"
            />
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {session.totalTime}
          </span>
          <span>{session.totalVolume}</span>
        </div>
      </div>

      {/* Focus Rule */}
      <div className="p-3 bg-gold-500/10 border-y border-gold-500/30">
        <p className="text-sm text-gold-500 font-medium text-center">
          Focus Rule: "{session.focusRule}"
        </p>
      </div>

      {/* Workout Parts */}
      <div className="p-4 space-y-6 bg-bb-dark/50">
        {session.parts.map((part, partIndex) => (
          <div key={partIndex} className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-bold text-white">{part.title}</h5>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {part.time}
              </span>
            </div>

            <div className="space-y-2 pl-4 border-l-2 border-bb-border">
              {part.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="text-sm">
                  {step.notes && (
                    <p className="text-xs text-gold-500 font-semibold mb-1">{step.notes}</p>
                  )}
                  <p className="text-gray-300">
                    {step.instruction}
                    {step.reps && (
                      <span className="text-gold-500 font-semibold ml-2">
                        → {step.reps} reps
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {part.totalShots && (
              <p className="text-xs text-green-400 font-medium pl-4">
                ✓ Total: {part.totalShots} shots
              </p>
            )}
          </div>
        ))}

        {/* Session Summary */}
        <div className="pt-4 border-t border-bb-border">
          <p className="text-sm text-gray-400">
            <span className="font-bold text-white">{session.totalVolume}</span>
            <span className="mx-2">—</span>
            {session.volumeNote}
          </p>
        </div>
      </div>

      {/* Logging Section */}
      {!readOnly && plan.playerPlanLogEnabled && (
        <div className="p-4 bg-bb-dark border-t border-bb-border space-y-4">
          <h5 className="text-sm font-semibold text-white flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-gold-500" />
            Log Your Results (Recommended)
          </h5>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Deep Distance Line</label>
              <Input
                type="number"
                min={0}
                max={10}
                placeholder="Steps behind 3PT"
                value={log.deepDistanceLineUsed || ''}
                onChange={(e) => onLogChange({ deepDistanceLineUsed: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">14-Spot Score</label>
              <Input
                type="number"
                min={0}
                max={14}
                placeholder="0-14"
                value={log.fourteenSpotScore || ''}
                onChange={(e) => onLogChange({ fourteenSpotScore: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Back Rim Streak</label>
              <Input
                type="number"
                min={0}
                max={50}
                placeholder="Best streak"
                value={log.backRimStreakAchieved || ''}
                onChange={(e) => onLogChange({ backRimStreakAchieved: parseInt(e.target.value) || undefined })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Notes: What felt easiest under stress?</label>
            <Textarea
              placeholder="What worked? What was hard?"
              value={log.notes}
              onChange={(e) => onLogChange({ notes: e.target.value })}
              className="min-h-[60px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for email/print
export function SevenDayPlanCompact({ plan }: { plan: StructuredSevenDayPlan }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-bold text-white mb-2">BB 7-Day Shooting Calibration Block</h4>
        <p className="text-sm text-gray-400">{plan.goal}</p>
      </div>

      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
        <p className="text-xs text-red-400 font-semibold">Rule: {plan.nonNegotiableRule}</p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-bb-border">
            <th className="py-2 pr-4">Day</th>
            <th className="py-2">Session</th>
          </tr>
        </thead>
        <tbody>
          {plan.schedule.map(({ day, session }) => {
            const sessionDef = plan.sessions[session];
            return (
              <tr key={day} className="border-b border-bb-border/50">
                <td className="py-2 pr-4 text-gold-500 font-bold">Day {day}</td>
                <td className="py-2 text-gray-300">
                  Session {session} — {sessionDef.name}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="text-xs text-gray-500">Each session: 35–50 min. Designed for in-season or offseason.</p>
    </div>
  );
}
