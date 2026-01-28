'use client';

import { RadioGroup } from '../RadioGroup';
import { NumberInput } from '../NumberInput';
import { VideoUrlInput } from '../VideoUrlInput';
import { MISS_PROFILE_OPTIONS } from '@/types/shooting-eval';
import type { BallFlightData, BallFlightArc, MissProfile } from '@/types/shooting-eval';

interface BallFlightSectionProps {
  data: Partial<BallFlightData>;
  onChange: (data: Partial<BallFlightData>) => void;
}

function ArcInput({
  arcType,
  angle,
  description,
  data,
  onChange,
}: {
  arcType: 'flat' | 'normal' | 'high';
  angle: string;
  description: string;
  data?: Partial<BallFlightArc>;
  onChange: (data: Partial<BallFlightArc>) => void;
}) {
  return (
    <div className="p-4 bg-bb-dark rounded-xl border border-bb-border space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-white capitalize">{arcType} Arc</h4>
        <span className="text-xs text-gold-500">{angle}</span>
      </div>
      <p className="text-xs text-gray-400">{description}</p>

      <NumberInput
        label="Makes + Back-Rim"
        value={data?.makes_or_backrim_7}
        onChange={(makes_or_backrim_7) => onChange({ ...data, makes_or_backrim_7 })}
        min={0}
        max={7}
        required
        helper="Out of 7 attempts"
      />

      <RadioGroup
        label="Miss Profile"
        options={MISS_PROFILE_OPTIONS}
        value={data?.miss_profile}
        onChange={(profile) => onChange({ ...data, miss_profile: profile as MissProfile })}
        required
        columns={3}
      />
    </div>
  );
}

export function BallFlightSection({ data, onChange }: BallFlightSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Ball Flight Spectrum</h2>
        <p className="text-sm text-gray-400 mb-4">
          Testing different arc trajectories
        </p>
        <div className="bg-bb-card border border-bb-border rounded-lg p-3 text-xs text-gray-400">
          <strong className="text-gold-500">Goal:</strong> Take 7 shots at each arc type.
          Count makes + back-rim hits as successes.
        </div>
      </div>

      <div className="space-y-4">
        <ArcInput
          arcType="flat"
          angle="~25°"
          description="Low, line-drive trajectory"
          data={data.flat}
          onChange={(flat) => onChange({ ...data, flat: flat as BallFlightArc })}
        />

        <ArcInput
          arcType="normal"
          angle="~45°"
          description="Standard mid-arc trajectory"
          data={data.normal}
          onChange={(normal) => onChange({ ...data, normal: normal as BallFlightArc })}
        />

        <ArcInput
          arcType="high"
          angle="~60°"
          description="High rainbow trajectory"
          data={data.high}
          onChange={(high) => onChange({ ...data, high: high as BallFlightArc })}
        />
      </div>

      {/* Summary */}
      {data.flat?.makes_or_backrim_7 !== undefined &&
        data.normal?.makes_or_backrim_7 !== undefined &&
        data.high?.makes_or_backrim_7 !== undefined && (
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400">Flat</p>
                <p className="text-xl font-bold text-white">{data.flat.makes_or_backrim_7}/7</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Normal</p>
                <p className="text-xl font-bold text-gold-500">{data.normal.makes_or_backrim_7}/7</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">High</p>
                <p className="text-xl font-bold text-white">{data.high.makes_or_backrim_7}/7</p>
              </div>
            </div>
          </div>
        )}

      <VideoUrlInput
        label="Ball Flight Video"
        value={data.video_url}
        onChange={(video_url) => onChange({ ...data, video_url })}
      />
    </div>
  );
}
