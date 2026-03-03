'use client';

import { VideoUrlInput } from '@/components/shooting-eval';
import { cn } from '@/lib/utils';
import type { MovementPatternsData, MovementPatternAssessment, MovementRating } from '@/types/coaching-client';

interface MovementPatternsSectionProps {
  data: Partial<MovementPatternsData>;
  onChange: (data: Partial<MovementPatternsData>) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Work',
  2: 'Developing',
  3: 'Average',
  4: 'Good',
  5: 'Advanced',
};

const RATING_COLORS: Record<number, string> = {
  1: 'border-red-500 bg-red-500/20 text-red-400',
  2: 'border-amber-500 bg-amber-500/20 text-amber-400',
  3: 'border-yellow-500 bg-yellow-500/20 text-yellow-400',
  4: 'border-green-500 bg-green-500/20 text-green-400',
  5: 'border-emerald-500 bg-emerald-500/20 text-emerald-400',
};

function PatternBlock({
  title,
  description,
  data,
  onChange,
}: {
  title: string;
  description: string;
  data: Partial<MovementPatternAssessment>;
  onChange: (val: Partial<MovementPatternAssessment>) => void;
}) {
  return (
    <div className="bg-bb-card border border-bb-border rounded-xl p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-400">
          Rating <span className="text-gold-500">*</span>
        </label>
        <div className="grid grid-cols-5 gap-2">
          {([1, 2, 3, 4, 5] as MovementRating[]).map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange({ ...data, rating })}
              className={cn(
                'flex flex-col items-center py-2 rounded-lg border text-center transition-all',
                data.rating === rating
                  ? RATING_COLORS[rating]
                  : 'border-bb-border bg-bb-dark text-gray-400 hover:border-gold-500/50'
              )}
            >
              <span className="text-lg font-bold">{rating}</span>
              <span className="text-[10px] leading-tight">{RATING_LABELS[rating]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-400">Notes</label>
        <textarea
          value={data.notes || ''}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="Observations, limitations, compensations..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-bb-border bg-bb-dark text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
        />
      </div>

      <VideoUrlInput
        label={`Video — ${title}`}
        value={data.video_url}
        onChange={(v) => onChange({ ...data, video_url: v })}
      />
    </div>
  );
}

export function MovementPatternsSection({ data, onChange }: MovementPatternsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Movement Pattern Assessment</h2>
        <p className="text-sm text-gray-400">
          Rate each movement pattern from 1-5. Film yourself performing each one so we can identify limiting factors and build your program.
        </p>
      </div>

      <PatternBlock
        title="Trail Leg"
        description="Your ability to load and drive off the trail leg during changes of direction. This is the foundation of deceleration and explosion."
        data={data.trail_leg || {}}
        onChange={(val) => onChange({ ...data, trail_leg: val })}
      />

      <PatternBlock
        title="Stops (Deceleration)"
        description="Your ability to stop abruptly from full speed — planting, absorbing force, and getting into a scoring position immediately."
        data={data.stops || {}}
        onChange={(val) => onChange({ ...data, stops: val })}
      />

      <PatternBlock
        title="Hip Mobility"
        description="Range of motion in your hips — internal/external rotation, flexion depth. Tight hips limit everything from lateral quickness to finishing."
        data={data.hip_mobility || {}}
        onChange={(val) => onChange({ ...data, hip_mobility: val })}
      />
    </div>
  );
}
