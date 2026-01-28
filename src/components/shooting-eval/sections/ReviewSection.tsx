'use client';

import type { ShootingEvalFormState, MissProfile } from '@/types/shooting-eval';
import { CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';
import type { EvalStep } from '@/hooks/useShootingEval';

interface ReviewSectionProps {
  data: ShootingEvalFormState;
  onEditSection: (step: EvalStep) => void;
  isSectionComplete: (section: keyof ShootingEvalFormState) => boolean;
}

const missProfileLabels: Record<MissProfile, string> = {
  mostly_short: 'Mostly Short',
  mostly_long: 'Mostly Long',
  mostly_left: 'Mostly Left',
  mostly_right: 'Mostly Right',
  mixed: 'Mixed',
};

function SectionCard({
  title,
  isComplete,
  onEdit,
  children,
}: {
  title: string;
  isComplete: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bb-card border border-bb-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-bb-border bg-bb-dark/50">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
          <span className="font-medium text-white">{title}</span>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-sm text-gold-500 hover:text-gold-400 transition-colors"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
      </div>
      <div className="p-4 text-sm text-gray-300">{children}</div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value ?? '—'}</span>
    </div>
  );
}

export function ReviewSection({ data, onEditSection, isSectionComplete }: ReviewSectionProps) {
  const playerInfo = data.player_info;
  const fourteenSpot = data.fourteen_spot;
  const deepDistance = data.deep_distance;
  const backRim = data.back_rim;
  const ballFlight = data.ball_flight;
  const fades = data.fades;
  const finalNotes = data.final_notes;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Review Your Evaluation</h2>
        <p className="text-sm text-gray-400">
          Check your data before submitting. Tap "Edit" to make changes.
        </p>
      </div>

      {/* Player Info */}
      <SectionCard
        title="Player Info"
        isComplete={isSectionComplete('player_info')}
        onEdit={() => onEditSection('player_info')}
      >
        <DataRow label="Name" value={playerInfo?.full_name} />
        <DataRow label="Age" value={playerInfo?.age} />
        <DataRow label="Level" value={playerInfo?.level?.replace('_', ' ')} />
        <DataRow label="Position" value={playerInfo?.primary_position} />
        <DataRow label="Dominant Hand" value={playerInfo?.dominant_hand} />
      </SectionCard>

      {/* 14-Spot Baseline */}
      <SectionCard
        title="14-Spot Baseline"
        isComplete={isSectionComplete('fourteen_spot')}
        onEdit={() => onEditSection('fourteen_spot')}
      >
        {fourteenSpot?.round_1 && (
          <DataRow
            label="Round 1"
            value={`${fourteenSpot.round_1.score}/14 • ${missProfileLabels[fourteenSpot.round_1.miss_profile] || '—'}`}
          />
        )}
        {fourteenSpot?.round_2 && (
          <DataRow
            label="Round 2"
            value={`${fourteenSpot.round_2.score}/14 • ${missProfileLabels[fourteenSpot.round_2.miss_profile] || '—'}`}
          />
        )}
        {fourteenSpot?.round_3 && (
          <DataRow
            label="Round 3"
            value={`${fourteenSpot.round_3.score}/14 • ${missProfileLabels[fourteenSpot.round_3.miss_profile] || '—'}`}
          />
        )}
        {fourteenSpot?.video_url && <DataRow label="Video" value="✓ Provided" />}
      </SectionCard>

      {/* Deep Distance */}
      <SectionCard
        title="Deep Distance Test"
        isComplete={isSectionComplete('deep_distance')}
        onEdit={() => onEditSection('deep_distance')}
      >
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-wide">Deep Line</div>
        <DataRow label="Steps Behind Line" value={deepDistance?.deep_distance_steps_behind_line} />
        <DataRow label="Rim Hits" value={deepDistance?.deep_line_rim_hits_10 !== undefined ? `${deepDistance.deep_line_rim_hits_10}/10` : undefined} />
        <DataRow label="Total Shots" value={deepDistance?.deep_line_total_shots_10} />

        <div className="mb-2 mt-3 text-xs text-gray-500 uppercase tracking-wide">Contrast</div>
        <DataRow label="Steps Forward" value={deepDistance?.contrast_steps_forward} />
        <DataRow label="Rim Hits" value={deepDistance?.contrast_rim_hits_10 !== undefined ? `${deepDistance.contrast_rim_hits_10}/10` : undefined} />
        <DataRow label="Total Shots" value={deepDistance?.contrast_total_shots_10} />
        {deepDistance?.video_url && <DataRow label="Video" value="✓ Provided" />}
      </SectionCard>

      {/* Back-Rim Challenge */}
      <SectionCard
        title="Back-Rim Challenge"
        isComplete={isSectionComplete('back_rim')}
        onEdit={() => onEditSection('back_rim')}
      >
        {backRim?.level_1 && (
          <DataRow
            label="Level 1 (1 back-rim → make)"
            value={`${backRim.level_1.total_shots} shots • ${backRim.level_1.time_seconds}s`}
          />
        )}
        {backRim?.level_2 && (
          <DataRow
            label="Level 2 (2 back-rim → make)"
            value={`${backRim.level_2.total_shots} shots • ${backRim.level_2.time_seconds}s`}
          />
        )}
        {backRim?.level_3 && (
          <DataRow
            label="Level 3 (3 back-rim → make)"
            value={`${backRim.level_3.total_shots} shots • ${backRim.level_3.time_seconds}s`}
          />
        )}
        {backRim?.video_url && <DataRow label="Video" value="✓ Provided" />}
      </SectionCard>

      {/* Ball Flight Spectrum */}
      <SectionCard
        title="Ball Flight Spectrum"
        isComplete={isSectionComplete('ball_flight')}
        onEdit={() => onEditSection('ball_flight')}
      >
        {ballFlight?.flat && (
          <DataRow
            label="Flat (~25°)"
            value={`${ballFlight.flat.makes_or_backrim_7}/7 • ${missProfileLabels[ballFlight.flat.miss_profile] || '—'}`}
          />
        )}
        {ballFlight?.normal && (
          <DataRow
            label="Normal (~45°)"
            value={`${ballFlight.normal.makes_or_backrim_7}/7 • ${missProfileLabels[ballFlight.normal.miss_profile] || '—'}`}
          />
        )}
        {ballFlight?.high && (
          <DataRow
            label="High (~60°)"
            value={`${ballFlight.high.makes_or_backrim_7}/7 • ${missProfileLabels[ballFlight.high.miss_profile] || '—'}`}
          />
        )}
        {ballFlight?.video_url && <DataRow label="Video" value="✓ Provided" />}
      </SectionCard>

      {/* Fades */}
      <SectionCard
        title="Fades"
        isComplete={isSectionComplete('fades')}
        onEdit={() => onEditSection('fades')}
      >
        {fades?.fade_right && (
          <DataRow
            label="Fade Right"
            value={`${fades.fade_right.makes_or_backrim_7}/7 • ${missProfileLabels[fades.fade_right.miss_profile] || '—'}`}
          />
        )}
        {fades?.fade_left && (
          <DataRow
            label="Fade Left"
            value={`${fades.fade_left.makes_or_backrim_7}/7 • ${missProfileLabels[fades.fade_left.miss_profile] || '—'}`}
          />
        )}
        {fades?.video_url && <DataRow label="Video" value="✓ Provided" />}
      </SectionCard>

      {/* Final Notes */}
      <SectionCard
        title="Final Notes"
        isComplete={true}
        onEdit={() => onEditSection('final_notes')}
      >
        {finalNotes?.anything_else ? (
          <p className="text-white">{finalNotes.anything_else}</p>
        ) : (
          <p className="text-gray-500 italic">No additional notes</p>
        )}
      </SectionCard>
    </div>
  );
}
