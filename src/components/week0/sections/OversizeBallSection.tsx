'use client';

import { NumberInput, VideoUrlInput } from '@/components/shooting-eval';
import type { OversizeBallData } from '@/types/coaching-client';

interface OversizeBallSectionProps {
  data: Partial<OversizeBallData>;
  onChange: (data: Partial<OversizeBallData>) => void;
}

export function OversizeBallSection({ data, onChange }: OversizeBallSectionProps) {
  const difference = (data.score_regular !== undefined && data.score_oversize !== undefined)
    ? data.score_regular - data.score_oversize
    : undefined;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Oversize Ball Test</h2>
        <p className="text-sm text-gray-400">
          Compare your shooting with a regular ball vs an oversize ball to measure energy transfer consistency.
        </p>
      </div>

      <div className="bg-bb-card border border-bb-border rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gold-500">How It Works</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>1. Shoot a 14-spot round with a <strong className="text-white">regular ball</strong></li>
          <li>2. Immediately shoot a 14-spot round with an <strong className="text-white">oversize ball</strong></li>
          <li>3. Record both scores below</li>
        </ul>
      </div>

      <NumberInput
        label="Regular Ball Score (out of 14)"
        value={data.score_regular}
        onChange={(v) => onChange({ ...data, score_regular: v })}
        min={0}
        max={14}
        required
      />

      <NumberInput
        label="Oversize Ball Score (out of 14)"
        value={data.score_oversize}
        onChange={(v) => onChange({ ...data, score_oversize: v })}
        min={0}
        max={14}
        required
      />

      {difference !== undefined && (
        <div className={`rounded-xl p-4 border ${difference <= 2 ? 'bg-green-500/10 border-green-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
          <p className="text-sm font-medium text-white">
            Score Difference: <span className={difference <= 2 ? 'text-green-400' : 'text-amber-400'}>{difference} shots</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {difference <= 2
              ? 'Great — your energy transfer is consistent across ball sizes.'
              : 'There\'s a gap. The oversize ball reveals areas where your energy system needs calibration.'}
          </p>
        </div>
      )}

      <NumberInput
        label="How many spots did you test?"
        value={data.spots_tested}
        onChange={(v) => onChange({ ...data, spots_tested: v })}
        min={1}
        max={14}
        helper="14 spots is the full test. Enter how many you completed."
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Notes</label>
        <textarea
          value={data.notes || ''}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="Any observations — which spots felt different? Where did the oversize ball help or hurt?"
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
        />
      </div>

      <VideoUrlInput
        label="Video of Oversize Ball Test"
        value={data.video_url}
        onChange={(v) => onChange({ ...data, video_url: v })}
      />
    </div>
  );
}
