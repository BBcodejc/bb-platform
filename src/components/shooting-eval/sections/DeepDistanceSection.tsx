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
          Testing your range and rim contact from deep
        </p>
      </div>

      {/* Deep Line Section */}
      <div className="p-4 bg-bb-dark rounded-xl border border-bb-border space-y-4">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 text-xs flex items-center justify-center font-bold">1</span>
          Deep Line (Behind 3PT)
        </h4>

        <NumberInput
          label="Steps behind the 3PT line"
          value={data.deep_distance_steps_behind_line}
          onChange={(val) => onChange({ ...data, deep_distance_steps_behind_line: val })}
          min={1}
          max={10}
          required
          helper="How many big steps behind the 3PT line is your deep distance line?"
        />

        <NumberInput
          label="Rim Hits (including makes)"
          value={data.deep_line_rim_hits_10}
          onChange={(val) => onChange({ ...data, deep_line_rim_hits_10: val })}
          min={0}
          max={10}
          required
          helper="Out of 10 attempts"
        />

        <NumberInput
          label="Total Shots Taken"
          value={data.deep_line_total_shots_10}
          onChange={(val) => onChange({ ...data, deep_line_total_shots_10: val })}
          min={10}
          max={30}
          required
          helper="How many shots did it take to get 10 attempts?"
          showStepper={false}
        />
      </div>

      {/* Forward Contrast Section */}
      <div className="p-4 bg-bb-dark rounded-xl border border-bb-border space-y-4">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 text-xs flex items-center justify-center font-bold">2</span>
          Forward Contrast (Closer)
        </h4>

        <NumberInput
          label="Steps forward from deep line"
          value={data.contrast_steps_forward}
          onChange={(val) => onChange({ ...data, contrast_steps_forward: val })}
          min={1}
          max={5}
          required
          helper="Usually 2 steps forward"
        />

        <NumberInput
          label="Rim Hits (including makes)"
          value={data.contrast_rim_hits_10}
          onChange={(val) => onChange({ ...data, contrast_rim_hits_10: val })}
          min={0}
          max={10}
          required
          helper="Out of 10 attempts"
        />

        <NumberInput
          label="Total Shots Taken"
          value={data.contrast_total_shots_10}
          onChange={(val) => onChange({ ...data, contrast_total_shots_10: val })}
          min={10}
          max={30}
          required
          helper="How many shots did it take to get 10 attempts?"
          showStepper={false}
        />
      </div>

      {/* Comparison */}
      {data.deep_line_rim_hits_10 !== undefined && data.contrast_rim_hits_10 !== undefined && (
        <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400">Deep Line</p>
              <p className="text-xl font-bold text-white">{data.deep_line_rim_hits_10}/10</p>
              <p className="text-xs text-gray-500">rim hits</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Forward</p>
              <p className="text-xl font-bold text-gold-500">{data.contrast_rim_hits_10}/10</p>
              <p className="text-xs text-gray-500">rim hits</p>
            </div>
          </div>
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
