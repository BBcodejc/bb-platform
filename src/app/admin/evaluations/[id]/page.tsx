'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Video,
  Save,
  Send,
  Star,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatLevel } from '@/lib/utils';
import type { MissType } from '@/types';

interface ShootingEvaluation {
  id: string;
  prospect_id: string;
  status: string;
  player_full_name: string;
  player_level: string;
  player_age: number;
  player_position: string;
  player_dominant_hand: string;
  fourteen_spot_round_1_score: number;
  fourteen_spot_round_1_miss_profile: string;
  fourteen_spot_round_2_score: number;
  fourteen_spot_round_2_miss_profile: string;
  fourteen_spot_round_3_score: number;
  fourteen_spot_round_3_miss_profile: string;
  fourteen_spot_video_url: string;
  deep_distance_steps_behind: number;
  deep_distance_video_url: string;
  back_rim_level_1_shots: number;
  back_rim_level_2_shots: number;
  back_rim_level_3_shots: number;
  back_rim_video_url: string;
  ball_flight_flat_makes: number;
  ball_flight_flat_miss_profile: string;
  ball_flight_normal_makes: number;
  ball_flight_normal_miss_profile: string;
  ball_flight_high_makes: number;
  ball_flight_high_miss_profile: string;
  ball_flight_video_url: string;
  fade_right_makes: number;
  fade_right_miss_profile: string;
  fade_left_makes: number;
  fade_left_miss_profile: string;
  fades_video_url: string;
  additional_notes: string;
  created_at: string;
  prospects?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    high_ticket_prospect: boolean;
  };
}

const missTypeOptions = [
  { value: 'short', label: 'Short' },
  { value: 'long', label: 'Long' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'front_rim', label: 'Front Rim' },
  { value: 'back_rim', label: 'Back Rim' },
];

const constraintOptions = [
  { value: 'insufficient_leg_drive', label: 'Insufficient leg drive' },
  { value: 'late_hand_involvement', label: 'Late hand involvement' },
  { value: 'inconsistent_set_point', label: 'Inconsistent set point' },
  { value: 'poor_deep_distance', label: 'Poor deep distance calibration' },
  { value: 'no_arc_variability', label: 'No arc variability' },
  { value: 'energy_leak', label: 'Energy leak in transfer' },
  { value: 'timing_issue', label: 'Timing/rhythm issue' },
];

const protocolOptions = [
  { value: 'deep_distance', label: 'Deep Distance Protocol' },
  { value: 'back_rim_calibration', label: 'Back-Rim Calibration' },
  { value: 'arc_variability', label: 'Arc Variability Training' },
  { value: 'flat_flight', label: 'Flat Flight (25°) Work' },
  { value: 'oversized_ball', label: 'Oversized Ball Gauntlet' },
  { value: 'speed_release', label: 'Speed Release Protocol' },
  { value: 'one_motion', label: 'One-Motion Energy Transfer' },
];

export default function EvaluationReviewPage() {
  const params = useParams();
  const router = useRouter();
  const prospectId = params.id as string;

  const [evaluation, setEvaluation] = useState<ShootingEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [assessment, setAssessment] = useState({
    currentBBLevel: 1,
    missProfilePrimary: 'short' as MissType,
    missProfileSecondary: '' as MissType | '',
    deepDistanceAnalysis: '',
    ballFlightAnalysis: '',
    energyTransferNotes: '',
    constraintsIdentified: [] as string[],
    priorityProtocols: [] as string[],
    weeklyPlanSummary: '',
    fourWeekFocus: '',
    fullAssessment: '',
    mentorshipFitScore: 5,
    mentorshipRecommendation: '',
    highTicketProspect: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function fetchEvaluation() {
      try {
        const response = await fetch(`/api/admin/evaluations/${prospectId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch evaluation');
        }

        setEvaluation(data.evaluation);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvaluation();
  }, [prospectId]);

  const handleSave = async () => {
    setIsSaving(true);
    // API call to save draft
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleSend = async () => {
    setIsSending(true);
    // API call to generate PDF and send to player
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSending(false);
    router.push('/admin/evaluations');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
      </main>
    );
  }

  if (error || !evaluation) {
    return (
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Evaluation not found'}</p>
          <Link href="/admin/evaluations">
            <Button variant="secondary">Back to Evaluations</Button>
          </Link>
        </div>
      </main>
    );
  }

  const playerName = evaluation.player_full_name ||
    `${evaluation.prospects?.first_name || ''} ${evaluation.prospects?.last_name || ''}`.trim() ||
    'Unknown';

  const avgScore = (
    (evaluation.fourteen_spot_round_1_score || 0) +
    (evaluation.fourteen_spot_round_2_score || 0) +
    (evaluation.fourteen_spot_round_3_score || 0)
  ) / 3;

  // Collect all video URLs
  const videoUrls = [
    { label: '14-Spot Video', url: evaluation.fourteen_spot_video_url },
    { label: 'Deep Distance Video', url: evaluation.deep_distance_video_url },
    { label: 'Back-Rim Video', url: evaluation.back_rim_video_url },
    { label: 'Ball Flight Video', url: evaluation.ball_flight_video_url },
    { label: 'Fades Video', url: evaluation.fades_video_url },
  ].filter(v => v.url);

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/evaluations">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-white">
              Evaluation: {playerName}
            </h1>
            <span className={cn(
              'px-2 py-1 rounded text-xs font-medium',
              evaluation.status === 'pending_review' ? 'bg-orange-500/20 text-orange-400' :
              evaluation.status === 'approved' ? 'bg-green-500/20 text-green-400' :
              'bg-gray-500/20 text-gray-400'
            )}>
              {evaluation.status?.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button onClick={handleSend} disabled={isSending}>
              <Send className="w-4 h-4 mr-2" />
              {isSending ? 'Sending...' : 'Send to Player'}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column - Player info & test results */}
          <div className="space-y-6">
            {/* Player info */}
            <Card>
              <CardHeader>
                <CardTitle>Player Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name</span>
                    <p className="text-white font-medium">{playerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Level</span>
                    <p className="text-white font-medium">
                      {formatLevel(evaluation.player_level) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Age</span>
                    <p className="text-white font-medium">
                      {evaluation.player_age || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Position</span>
                    <p className="text-white font-medium">
                      {evaluation.player_position || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Dominant Hand</span>
                    <p className="text-white font-medium">
                      {evaluation.player_dominant_hand || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email</span>
                    <p className="text-white font-medium">
                      {evaluation.prospects?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                {evaluation.additional_notes && (
                  <div className="pt-4 border-t border-bb-border">
                    <span className="text-gray-400 text-sm">Player Notes</span>
                    <p className="text-white text-sm mt-1">
                      {evaluation.additional_notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test results */}
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 14-Spot */}
                <div>
                  <h4 className="text-sm font-medium text-gold-400 mb-2">
                    14-Spot Baseline
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center mb-2">
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.fourteen_spot_round_1_score ?? '-'}
                      </p>
                      <p className="text-xs text-gray-400">Round 1</p>
                      {evaluation.fourteen_spot_round_1_miss_profile && (
                        <p className="text-xs text-gray-500 mt-1">
                          Miss: {evaluation.fourteen_spot_round_1_miss_profile}
                        </p>
                      )}
                    </div>
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.fourteen_spot_round_2_score ?? '-'}
                      </p>
                      <p className="text-xs text-gray-400">Round 2</p>
                      {evaluation.fourteen_spot_round_2_miss_profile && (
                        <p className="text-xs text-gray-500 mt-1">
                          Miss: {evaluation.fourteen_spot_round_2_miss_profile}
                        </p>
                      )}
                    </div>
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.fourteen_spot_round_3_score ?? '-'}
                      </p>
                      <p className="text-xs text-gray-400">Round 3</p>
                      {evaluation.fourteen_spot_round_3_miss_profile && (
                        <p className="text-xs text-gray-500 mt-1">
                          Miss: {evaluation.fourteen_spot_round_3_miss_profile}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded text-center">
                    <p className="text-2xl font-bold text-gold-500">
                      {avgScore.toFixed(1)}/14
                    </p>
                    <p className="text-xs text-gray-400">Average</p>
                  </div>
                </div>

                {/* Deep Distance */}
                <div>
                  <h4 className="text-sm font-medium text-gold-400 mb-2">
                    Deep Distance Test
                  </h4>
                  <div className="p-3 bg-bb-card rounded border border-bb-border text-center">
                    <p className="text-2xl font-bold text-white">
                      {evaluation.deep_distance_steps_behind ?? '-'}
                    </p>
                    <p className="text-xs text-gray-400">Steps behind 3PT line</p>
                  </div>
                </div>

                {/* Back Rim */}
                <div>
                  <h4 className="text-sm font-medium text-gold-400 mb-2">
                    Back-Rim Challenge
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.back_rim_level_1_shots ?? '-'}
                      </p>
                      <p className="text-xs text-gray-400">Level 1 Shots</p>
                    </div>
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.back_rim_level_2_shots ?? '-'}
                      </p>
                      <p className="text-xs text-gray-400">Level 2 Shots</p>
                    </div>
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.back_rim_level_3_shots ?? '-'}
                      </p>
                      <p className="text-xs text-gray-400">Level 3 Shots</p>
                    </div>
                  </div>
                </div>

                {/* Ball Flight Spectrum */}
                <div>
                  <h4 className="text-sm font-medium text-gold-400 mb-2">
                    Ball Flight Spectrum
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.ball_flight_flat_makes ?? '-'}/7
                      </p>
                      <p className="text-xs text-gray-400">Flat Arc</p>
                      {evaluation.ball_flight_flat_miss_profile && (
                        <p className="text-xs text-gray-500 mt-1">
                          {evaluation.ball_flight_flat_miss_profile}
                        </p>
                      )}
                    </div>
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.ball_flight_normal_makes ?? '-'}/7
                      </p>
                      <p className="text-xs text-gray-400">Normal Arc</p>
                      {evaluation.ball_flight_normal_miss_profile && (
                        <p className="text-xs text-gray-500 mt-1">
                          {evaluation.ball_flight_normal_miss_profile}
                        </p>
                      )}
                    </div>
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.ball_flight_high_makes ?? '-'}/7
                      </p>
                      <p className="text-xs text-gray-400">High Arc</p>
                      {evaluation.ball_flight_high_miss_profile && (
                        <p className="text-xs text-gray-500 mt-1">
                          {evaluation.ball_flight_high_miss_profile}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fades */}
                <div>
                  <h4 className="text-sm font-medium text-gold-400 mb-2">
                    Fades
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.fade_right_makes ?? '-'}/7
                      </p>
                      <p className="text-xs text-gray-400">Fade Right</p>
                      {evaluation.fade_right_miss_profile && (
                        <p className="text-xs text-gray-500 mt-1">
                          {evaluation.fade_right_miss_profile}
                        </p>
                      )}
                    </div>
                    <div className="p-2 bg-bb-card rounded border border-bb-border">
                      <p className="text-xl font-bold text-white">
                        {evaluation.fade_left_makes ?? '-'}/7
                      </p>
                      <p className="text-xs text-gray-400">Fade Left</p>
                      {evaluation.fade_left_miss_profile && (
                        <p className="text-xs text-gray-500 mt-1">
                          {evaluation.fade_left_miss_profile}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video links */}
            {videoUrls.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-gold-500" />
                    Video Footage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {videoUrls.map((video, index) => (
                    <a
                      key={index}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded bg-bb-card border border-bb-border hover:border-gold-500 transition-colors"
                    >
                      <span className="text-sm text-white">{video.label}</span>
                      <ExternalLink className="w-4 h-4 text-gold-500" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column - Assessment form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* BB Level */}
                <Select
                  label="Current BB Level"
                  options={[
                    { value: '0', label: 'Unranked', description: 'Below Level 1 standards' },
                    { value: '1', label: 'Level 1 - Foundation', description: 'Energy Awareness' },
                    { value: '2', label: 'Level 2 - Calibrated', description: 'Impulse & Precision' },
                    { value: '3', label: 'Level 3 - Adaptive', description: 'Constraint Integration' },
                    { value: '4', label: 'Level 4 - Master', description: 'Reflexive Dominance' },
                  ]}
                  value={assessment.currentBBLevel.toString()}
                  onChange={(v) =>
                    setAssessment({ ...assessment, currentBBLevel: parseInt(v) })
                  }
                />

                {/* Miss Profile */}
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Primary Miss"
                    options={missTypeOptions}
                    value={assessment.missProfilePrimary}
                    onChange={(v) =>
                      setAssessment({
                        ...assessment,
                        missProfilePrimary: v as MissType,
                      })
                    }
                  />
                  <Select
                    label="Secondary Miss"
                    options={[{ value: '', label: 'None' }, ...missTypeOptions]}
                    value={assessment.missProfileSecondary}
                    onChange={(v) =>
                      setAssessment({
                        ...assessment,
                        missProfileSecondary: v as MissType | '',
                      })
                    }
                  />
                </div>

                {/* Analysis sections */}
                <Textarea
                  label="Deep Distance Analysis"
                  value={assessment.deepDistanceAnalysis}
                  onChange={(e) =>
                    setAssessment({
                      ...assessment,
                      deepDistanceAnalysis: e.target.value,
                    })
                  }
                  placeholder="Analysis of their deep distance test results..."
                />

                <Textarea
                  label="Ball Flight Analysis"
                  value={assessment.ballFlightAnalysis}
                  onChange={(e) =>
                    setAssessment({
                      ...assessment,
                      ballFlightAnalysis: e.target.value,
                    })
                  }
                  placeholder="Observations about their ball flight patterns..."
                />

                <Textarea
                  label="Energy Transfer Notes"
                  value={assessment.energyTransferNotes}
                  onChange={(e) =>
                    setAssessment({
                      ...assessment,
                      energyTransferNotes: e.target.value,
                    })
                  }
                  placeholder="Notes on their energy transfer and mechanics..."
                />

                {/* Constraints */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Constraints Identified
                  </label>
                  <div className="space-y-2">
                    {constraintOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        checked={assessment.constraintsIdentified.includes(
                          option.value
                        )}
                        onChange={() => {
                          const newConstraints =
                            assessment.constraintsIdentified.includes(option.value)
                              ? assessment.constraintsIdentified.filter(
                                  (c) => c !== option.value
                                )
                              : [...assessment.constraintsIdentified, option.value];
                          setAssessment({
                            ...assessment,
                            constraintsIdentified: newConstraints,
                          });
                        }}
                        label={option.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Priority Protocols */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Priority Protocols (select up to 3)
                  </label>
                  <div className="space-y-2">
                    {protocolOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        checked={assessment.priorityProtocols.includes(
                          option.value
                        )}
                        onChange={() => {
                          const current = assessment.priorityProtocols;
                          let newProtocols;
                          if (current.includes(option.value)) {
                            newProtocols = current.filter(
                              (p) => p !== option.value
                            );
                          } else if (current.length < 3) {
                            newProtocols = [...current, option.value];
                          } else {
                            return;
                          }
                          setAssessment({
                            ...assessment,
                            priorityProtocols: newProtocols,
                          });
                        }}
                        label={option.label}
                        disabled={
                          assessment.priorityProtocols.length >= 3 &&
                          !assessment.priorityProtocols.includes(option.value)
                        }
                      />
                    ))}
                  </div>
                </div>

                <Textarea
                  label="Weekly Plan Summary"
                  value={assessment.weeklyPlanSummary}
                  onChange={(e) =>
                    setAssessment({
                      ...assessment,
                      weeklyPlanSummary: e.target.value,
                    })
                  }
                  placeholder="Brief summary of what they should do each week..."
                />

                <Textarea
                  label="4-Week Focus"
                  value={assessment.fourWeekFocus}
                  onChange={(e) =>
                    setAssessment({
                      ...assessment,
                      fourWeekFocus: e.target.value,
                    })
                  }
                  placeholder="What to focus on for the next 4 weeks..."
                />

                <Textarea
                  label="Full Written Assessment"
                  value={assessment.fullAssessment}
                  onChange={(e) =>
                    setAssessment({
                      ...assessment,
                      fullAssessment: e.target.value,
                    })
                  }
                  placeholder="Complete assessment that will appear in their BB Profile..."
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            {/* High-ticket recommendation */}
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gold-500" />
                  Mentorship Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Fit Score (1-10)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={assessment.mentorshipFitScore}
                    onChange={(e) =>
                      setAssessment({
                        ...assessment,
                        mentorshipFitScore: parseInt(e.target.value) || 5,
                      })
                    }
                  />
                </div>

                <Textarea
                  label="Recommendation Notes"
                  value={assessment.mentorshipRecommendation}
                  onChange={(e) =>
                    setAssessment({
                      ...assessment,
                      mentorshipRecommendation: e.target.value,
                    })
                  }
                  placeholder="Why would this player be a good fit for the 3-month mentorship?"
                />

                <Checkbox
                  checked={assessment.highTicketProspect}
                  onChange={(checked) =>
                    setAssessment({
                      ...assessment,
                      highTicketProspect: checked,
                    })
                  }
                  label="Mark as High-Ticket Prospect"
                  description="This player will receive the upsell sequence after profile delivery"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
