'use client';

import { NumberInput, RadioGroup, VideoUrlInput } from '@/components/shooting-eval';
import { APPROACH_TYPE_OPTIONS } from '@/types/coaching-client';
import type { VerticalJumpData } from '@/types/coaching-client';

interface VerticalJumpSectionProps {
  data: Partial<VerticalJumpData>;
  onChange: (data: Partial<VerticalJumpData>) => void;
}

export function VerticalJumpSection({ data, onChange }: VerticalJumpSectionProps) {
  const vertInches = (data.standing_reach_inches && data.max_vert_inches)
    ? data.max_vert_inches - data.standing_reach_inches
    : undefined;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Vertical Jump Test</h2>
        <p className="text-sm text-gray-400">
          Measure your explosiveness. We use this to track athletic development and set your court work targets.
        </p>
      </div>

      <div className="bg-bb-card border border-bb-border rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gold-500">How to Measure</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>1. Stand flat-footed under a wall or measuring device</li>
          <li>2. Reach up as high as you can — that&apos;s your <strong className="text-white">standing reach</strong></li>
          <li>3. Jump as high as you can and touch the highest point — that&apos;s your <strong className="text-white">max jump reach</strong></li>
          <li>4. The difference is your vertical</li>
        </ul>
      </div>

      <NumberInput
        label="Standing Reach (inches)"
        value={data.standing_reach_inches}
        onChange={(v) => onChange({ ...data, standing_reach_inches: v })}
        min={60}
        max={120}
        helper="Flat-footed reach as high as possible"
      />

      <NumberInput
        label="Max Jump Reach (inches)"
        value={data.max_vert_inches}
        onChange={(v) => onChange({ ...data, max_vert_inches: v })}
        min={60}
        max={150}
        required
        helper="Highest point you can touch in a jump"
      />

      {vertInches !== undefined && vertInches > 0 && (
        <div className="rounded-xl p-4 border bg-gold-500/10 border-gold-500/30">
          <p className="text-sm font-medium text-white">
            Vertical: <span className="text-gold-400 text-lg font-bold">{vertInches}&quot;</span>
          </p>
        </div>
      )}

      <RadioGroup
        label="Approach Type"
        options={APPROACH_TYPE_OPTIONS}
        value={data.approach_type}
        onChange={(v) => onChange({ ...data, approach_type: v as any })}
        columns={3}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Notes</label>
        <textarea
          value={data.notes || ''}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="Any notes — injury history, preferred approach, etc."
          rows={2}
          className="w-full px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
        />
      </div>

      <VideoUrlInput
        label="Video of Vertical Jump"
        value={data.video_url}
        onChange={(v) => onChange({ ...data, video_url: v })}
      />
    </div>
  );
}
