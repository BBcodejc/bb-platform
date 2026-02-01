'use client';

import { NumberInput } from '../NumberInput';
import { VideoUrlInput } from '../VideoUrlInput';
import type { DeepDistanceData } from '@/types/shooting-eval';

interface DeepDistanceSectionProps {
  data: Partial<DeepDistanceData>;
  onChange: (data: Partial<DeepDistanceData>) => void;
}

export function DeepDistanceSection({ data, onChange }: DeepDistanceSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Deep Distance Test</h2>
        <p className="text-sm text-gray-400">
          Find your deep distance line
        </p>
        <div className="bg-bb-card border border-bb-border rounded-lg p-3 text-xs text-gray-400 mt-4">
          <strong className="text-gold-500">How to find it:</strong> Start at the 3-point line, take 5 shots.
          Step back 1 step, take 5 more. Keep stepping back until you can't reach the rim cleanly.
        </div>
      </div>

      {/* Deep Line Section */}
      <div className="p-4 bg-bb-dark rounded-xl border border-bb-border space-y-4">
        <h4 className="font-semibold text-white">Your Deep Distance Line</h4>

        <NumberInput
          label="Steps behind the 3PT line"
          value={data.deep_distance_steps_behind_line}
          onChange={(val) => onChange({ ...data, deep_distance_steps_behind_line: val })}
          min={0}
          max={10}
          required
          helper="How many big steps behind the 3PT line until you can't reach the rim cleanly?"
        />
      </div>

      {/* Display result */}
      {data.deep_distance_steps_behind_line !== undefined && (
        <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400">Your Deep Distance Line</p>
          <p className="text-2xl font-bold text-gold-500">
            {data.deep_distance_steps_behind_line} step{data.deep_distance_steps_behind_line !== 1 ? 's' : ''} behind 3PT
          </p>
        </div>
      )}

      <VideoUrlInput
        label="Deep Distance Video"
        value={data.video_url}
        onChange={(video_url) => onChange({ ...data, video_url })}
      />
    </div>
  );
}
