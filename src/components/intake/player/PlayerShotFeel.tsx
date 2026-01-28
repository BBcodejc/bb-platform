'use client';

import { cn } from '@/lib/utils';
import { THREE_PT_PERCENTAGES } from '@/types';
import type { IntakeFormData, ThreePtPercentage } from '@/types';

interface PlayerShotFeelProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function PlayerShotFeel({ data, onChange }: PlayerShotFeelProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Game vs Workout */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How does your shot feel in games vs workouts?
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Describe it in your own words. Example: &quot;I shoot great in workouts but hesitate in games&quot;
        </p>
        <textarea
          value={data.gameVsWorkout || ''}
          onChange={(e) => onChange({ gameVsWorkout: e.target.value })}
          placeholder="Tell us how your shot feels..."
          className="w-full h-32 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
        />
      </div>

      {/* 3PT Percentage */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What&apos;s your current 3PT % in games?
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          If you don&apos;t know, leave an estimate
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {THREE_PT_PERCENTAGES.map((pct) => (
            <button
              key={pct.value}
              onClick={() => onChange({ threePtPercentage: pct.value as ThreePtPercentage })}
              className={cn(
                'text-center px-4 py-3 rounded-lg border transition-all',
                data.threePtPercentage === pct.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {pct.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
