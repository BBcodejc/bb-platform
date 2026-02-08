'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Video,
  Save,
  Send,
  Star,
  RefreshCw,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar,
  Target,
  Zap,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatLevel } from '@/lib/utils';
import { PlanBuilder } from '@/components/admin/PlanBuilder';
import { MacroDropdown, GenerateAllButton } from '@/components/admin/MacroDropdown';
import { type MacroVariables } from '@/lib/bbMacros';
import {
  type StructuredSevenDayPlan,
  type DayLog,
  generateStructuredPlan,
  DEFAULT_KNOBS,
  DEFAULT_SCHEDULE,
  planToSimpleFormat,
} from '@/lib/seven-day-plan';

// Types
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
  deep_distance_makes: number;
  deep_distance_attempts: number;
  deep_distance_notes: string;
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
  // Assessment fields (coach fills out)
  bb_level?: number;
  primary_miss?: string;
  secondary_miss?: string;
  miss_profile_summary?: string;
  deep_distance_diagnosis?: string;
  back_rim_diagnosis?: string;
  ball_flight_diagnosis?: string;
  shooting_limiting_factors?: string[];
  selected_protocols?: string[];
  seven_day_plan?: SevenDayPlan;
  structured_seven_day_plan?: StructuredSevenDayPlan;
  player_plan_logs?: DayLog[];
  written_assessment?: string;
  routing_decision?: string;
  mentorship_fit_score?: number;
  mentorship_notes?: string;
  is_high_ticket_prospect?: boolean;
  assessment_status?: 'draft' | 'ready' | 'delivered';
  delivered_at?: string;
  prospects?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    high_ticket_prospect: boolean;
  };
}

interface DayPlan {
  warmup: string;
  mainWork: string;
  finish: string;
}

interface SevenDayPlan {
  day1: DayPlan;
  day2: DayPlan;
  day3: DayPlan;
  day4: DayPlan;
  day5: DayPlan;
  day6: DayPlan;
  day7: DayPlan;
}

// Options
const bbLevelOptions = [
  { value: '1', label: 'Level 1 - Foundation', description: 'Energy awareness present, back-rim control inconsistent' },
  { value: '2', label: 'Level 2 - Calibrated', description: 'Precise back-rim targeting, flight control emerging' },
  { value: '3', label: 'Level 3 - Adaptive', description: 'Constraint mastery, speed/stress resilience' },
  { value: '4', label: 'Level 4 - Master', description: 'Professional-level BB calibrated shooter' },
];

const missTypeOptions = [
  { value: 'short', label: 'Short' },
  { value: 'long', label: 'Long' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'front_rim', label: 'Front Rim' },
  { value: 'back_rim', label: 'Back Rim (Good)' },
];

const shootingLimitingFactorOptions = [
  {
    value: 'horizontal_distance_control',
    label: 'Horizontal Distance Control Issue',
    description: 'Short/long instability; target control inconsistent'
  },
  {
    value: 'two_motion_pause',
    label: 'Two-Motion / Pause Pattern',
    description: 'Timing break / hitch shows up under stress'
  },
  {
    value: 'internal_cueing',
    label: 'Internal Cueing / Top-Down Control',
    description: 'Mechanics dominate under speed/stress'
  },
];

const protocolOptions = [
  { value: 'deep_distance', label: 'Deep Distance Protocol' },
  { value: 'back_rim_calibration', label: 'Back-Rim Calibration' },
  { value: 'ball_flight_spectrum', label: 'Ball Flight Spectrum (25°/45°/60°)' },
  { value: 'oversized_ball', label: 'Oversized Ball Gauntlet' },
  { value: 'strobe_calibration', label: 'Strobe Calibration (Level 1/2/3)' },
  { value: 'speed_release', label: 'Speed Release Protocol' },
  { value: 'constraint_integration', label: 'Constraint Integration (blockers/contact)' },
];

const routingOptions = [
  { value: 'shooting_only', label: 'Shooting Only', description: 'Keep on shooting track' },
  { value: 'full_assessment', label: 'Full BB Assessment', description: 'Apply for full game assessment' },
  { value: 'certification', label: 'Coach Certification', description: 'Interested in becoming BB certified' },
];

// Default 7-day plan template generator
function generateDefaultPlan(protocols: string[]): SevenDayPlan {
  const hasDeepDistance = protocols.includes('deep_distance');
  const hasBackRim = protocols.includes('back_rim_calibration');
  const hasBallFlight = protocols.includes('ball_flight_spectrum');
  const hasOversized = protocols.includes('oversized_ball');
  const hasStrobe = protocols.includes('strobe_calibration');
  const hasSpeed = protocols.includes('speed_release');

  const defaultDay: DayPlan = {
    warmup: 'Catch variety + hops (3 min)',
    mainWork: '',
    finish: '7-spot test out',
  };

  return {
    day1: {
      ...defaultDay,
      mainWork: hasBackRim ? 'Back-Rim Response Ladder (8 min)' : 'Ball Flight Spectrum - all 3 arcs (6 min)',
    },
    day2: {
      ...defaultDay,
      mainWork: hasDeepDistance ? 'Deep Distance Calibration - find battle distance (10 min)' : 'Speed variation work (8 min)',
    },
    day3: {
      ...defaultDay,
      mainWork: hasBallFlight ? 'Ball Flight control - flat/normal/high on command (8 min)' : 'Back-Rim ladder (6 min)',
    },
    day4: {
      warmup: 'Light catch work (2 min)',
      mainWork: 'OFF DAY - Rhythm makes only, 2 per spot',
      finish: 'Leave feeling good',
    },
    day5: {
      ...defaultDay,
      mainWork: hasOversized ? 'Oversized ball gauntlet (10 min)' : hasStrobe ? 'Strobe calibration Level 1 (8 min)' : 'Miss → Fix from 3 spots (8 min)',
    },
    day6: {
      ...defaultDay,
      mainWork: hasSpeed ? 'Speed release work - fast/normal/slow (8 min)' : 'Deep distance ladder + back-rim combo (10 min)',
    },
    day7: {
      warmup: 'Full Game Day protocol warmup',
      mainWork: '14-spot test (track score)',
      finish: 'Note: compare to baseline',
    },
  };
}

// Auto-generate written assessment
function generateWrittenAssessment(data: {
  playerName: string;
  bbLevel: number;
  primaryMiss: string;
  secondaryMiss: string;
  missProfileSummary: string;
  deepDistanceDiagnosis: string;
  backRimDiagnosis: string;
  ballFlightDiagnosis: string;
  limitingFactors: string[];
  protocols: string[];
  avgScore: number;
  sevenDayPlan: SevenDayPlan;
}): string {
  const levelDescriptions: Record<number, string> = {
    1: "You're at BB Level 1 (Foundation) - you have energy awareness but back-rim control needs work.",
    2: "You're at BB Level 2 (Calibrated) - you can target the back rim with precision, and flight control is emerging.",
    3: "You're at BB Level 3 (Adaptive) - you've shown constraint mastery and resilience under speed/stress.",
    4: "You're at BB Level 4 (Master) - you're operating at a professional-level BB calibration.",
  };

  const protocolNames: Record<string, string> = {
    deep_distance: 'Deep Distance Protocol',
    back_rim_calibration: 'Back-Rim Calibration',
    ball_flight_spectrum: 'Ball Flight Spectrum',
    oversized_ball: 'Oversized Ball Gauntlet',
    strobe_calibration: 'Strobe Calibration',
    speed_release: 'Speed Release Protocol',
    constraint_integration: 'Constraint Integration',
  };

  const limitingFactorNames: Record<string, string> = {
    horizontal_distance_control: 'horizontal distance control',
    two_motion_pause: 'a two-motion/pause pattern',
    internal_cueing: 'internal cueing that takes over under stress',
  };

  let assessment = `${data.playerName},\n\n`;
  assessment += `After reviewing your test results and video footage, here's your BB Profile.\n\n`;

  // Level
  assessment += `**YOUR BB LEVEL**\n${levelDescriptions[data.bbLevel] || levelDescriptions[1]}\n\n`;

  // Miss Profile
  assessment += `**MISS PROFILE**\n`;
  assessment += `Your primary miss tendency is ${data.primaryMiss}${data.secondaryMiss ? `, with ${data.secondaryMiss} as secondary` : ''}. `;
  if (data.missProfileSummary) {
    assessment += data.missProfileSummary;
  }
  assessment += `\n\n`;

  // Diagnoses
  if (data.deepDistanceDiagnosis) {
    assessment += `**DEEP DISTANCE**\n${data.deepDistanceDiagnosis}\n\n`;
  }
  if (data.backRimDiagnosis) {
    assessment += `**BACK-RIM CONTROL**\n${data.backRimDiagnosis}\n\n`;
  }
  if (data.ballFlightDiagnosis) {
    assessment += `**BALL FLIGHT**\n${data.ballFlightDiagnosis}\n\n`;
  }

  // Limiting factors
  if (data.limitingFactors.length > 0) {
    assessment += `**KEY LIMITING FACTORS**\n`;
    assessment += `Based on your tests, we've identified ${data.limitingFactors.map(f => limitingFactorNames[f] || f).join(', ')} as areas to address.\n\n`;
  }

  // Protocols
  if (data.protocols.length > 0) {
    assessment += `**YOUR TOP PROTOCOLS**\n`;
    assessment += `For the next 7 days, focus on:\n`;
    data.protocols.forEach((p, i) => {
      assessment += `${i + 1}. ${protocolNames[p] || p}\n`;
    });
    assessment += `\n`;
  }

  // 7-Day Plan
  assessment += `**YOUR 7-DAY PLAN**\n`;
  const days = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'] as const;
  days.forEach((day, i) => {
    const plan = data.sevenDayPlan[day];
    assessment += `Day ${i + 1}: ${plan.warmup} → ${plan.mainWork} → ${plan.finish}\n`;
  });
  assessment += `\n`;

  // Closing
  assessment += `Your 14-spot average was ${data.avgScore.toFixed(1)}/14. Run your 7-day plan, then retest to see your progress.\n\n`;
  assessment += `Read the miss → get the ball back to the target. That's the skill.\n\n`;
  assessment += `— Coach Jake`;

  return assessment;
}

export default function EvaluationReviewPage() {
  const params = useParams();
  const router = useRouter();
  const prospectId = params.id as string;

  const [evaluation, setEvaluation] = useState<ShootingEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activePanel, setActivePanel] = useState<'diagnosis' | 'prescription' | 'delivery'>('diagnosis');

  // Assessment state
  const [assessment, setAssessment] = useState({
    bbLevel: 1,
    primaryMiss: 'short',
    secondaryMiss: '',
    missProfileSummary: '',
    deepDistanceDiagnosis: '',
    backRimDiagnosis: '',
    ballFlightDiagnosis: '',
    shootingLimitingFactors: [] as string[],
    selectedProtocols: [] as string[],
    sevenDayPlan: generateDefaultPlan([]),
    structuredSevenDayPlan: generateStructuredPlan(DEFAULT_KNOBS, DEFAULT_SCHEDULE, false) as StructuredSevenDayPlan,
    writtenAssessment: '',
    routingDecision: 'shooting_only',
    mentorshipFitScore: 5,
    mentorshipNotes: '',
    isHighTicketProspect: false,
    assessmentStatus: 'draft' as 'draft' | 'ready' | 'delivered',
  });

  // Fetch evaluation data
  useEffect(() => {
    async function fetchEvaluation() {
      try {
        const response = await fetch(`/api/admin/evaluations/${prospectId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch evaluation');
        }

        setEvaluation(data.evaluation);

        // Load existing assessment data if available
        const ev = data.evaluation;
        if (ev.bb_level || ev.selected_protocols) {
          setAssessment(prev => ({
            ...prev,
            bbLevel: ev.bb_level || 1,
            primaryMiss: ev.primary_miss || 'short',
            secondaryMiss: ev.secondary_miss || '',
            missProfileSummary: ev.miss_profile_summary || '',
            deepDistanceDiagnosis: ev.deep_distance_diagnosis || '',
            backRimDiagnosis: ev.back_rim_diagnosis || '',
            ballFlightDiagnosis: ev.ball_flight_diagnosis || '',
            shootingLimitingFactors: ev.shooting_limiting_factors || [],
            selectedProtocols: ev.selected_protocols || [],
            sevenDayPlan: ev.seven_day_plan || generateDefaultPlan([]),
            structuredSevenDayPlan: ev.structured_seven_day_plan || generateStructuredPlan(DEFAULT_KNOBS, DEFAULT_SCHEDULE, false),
            writtenAssessment: ev.written_assessment || '',
            routingDecision: ev.routing_decision || 'shooting_only',
            mentorshipFitScore: ev.mentorship_fit_score || 5,
            mentorshipNotes: ev.mentorship_notes || '',
            isHighTicketProspect: ev.is_high_ticket_prospect || false,
            assessmentStatus: ev.assessment_status || 'draft',
          }));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvaluation();
  }, [prospectId]);

  // Computed values
  const playerName = useMemo(() => {
    if (!evaluation) return 'Unknown';
    return evaluation.player_full_name ||
      `${evaluation.prospects?.first_name || ''} ${evaluation.prospects?.last_name || ''}`.trim() ||
      'Unknown';
  }, [evaluation]);

  const avgScore = useMemo(() => {
    if (!evaluation) return 0;
    return (
      (evaluation.fourteen_spot_round_1_score || 0) +
      (evaluation.fourteen_spot_round_2_score || 0) +
      (evaluation.fourteen_spot_round_3_score || 0)
    ) / 3;
  }, [evaluation]);

  // Check if ready to deliver
  const canMarkReady = useMemo(() => {
    return (
      assessment.bbLevel >= 1 &&
      assessment.selectedProtocols.length > 0 &&
      assessment.writtenAssessment.trim().length > 50
    );
  }, [assessment]);

  // Update 7-day plan when protocols change
  useEffect(() => {
    if (assessment.selectedProtocols.length > 0) {
      setAssessment(prev => ({
        ...prev,
        sevenDayPlan: generateDefaultPlan(prev.selectedProtocols),
      }));
    }
  }, [assessment.selectedProtocols.length]);

  // Handlers
  const handleProtocolToggle = (protocol: string) => {
    const current = assessment.selectedProtocols;
    let newProtocols;
    if (current.includes(protocol)) {
      newProtocols = current.filter(p => p !== protocol);
    } else if (current.length < 3) {
      newProtocols = [...current, protocol];
    } else {
      return; // Max 3
    }
    setAssessment(prev => ({
      ...prev,
      selectedProtocols: newProtocols,
    }));
  };

  const handleGenerateAssessment = () => {
    const generated = generateWrittenAssessment({
      playerName: playerName.split(' ')[0],
      bbLevel: assessment.bbLevel,
      primaryMiss: assessment.primaryMiss,
      secondaryMiss: assessment.secondaryMiss,
      missProfileSummary: assessment.missProfileSummary,
      deepDistanceDiagnosis: assessment.deepDistanceDiagnosis,
      backRimDiagnosis: assessment.backRimDiagnosis,
      ballFlightDiagnosis: assessment.ballFlightDiagnosis,
      limitingFactors: assessment.shootingLimitingFactors,
      protocols: assessment.selectedProtocols,
      avgScore,
      sevenDayPlan: assessment.sevenDayPlan,
    });
    setAssessment(prev => ({ ...prev, writtenAssessment: generated }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/evaluations/${prospectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bb_level: assessment.bbLevel,
          primary_miss: assessment.primaryMiss,
          secondary_miss: assessment.secondaryMiss,
          miss_profile_summary: assessment.missProfileSummary,
          deep_distance_diagnosis: assessment.deepDistanceDiagnosis,
          back_rim_diagnosis: assessment.backRimDiagnosis,
          ball_flight_diagnosis: assessment.ballFlightDiagnosis,
          shooting_limiting_factors: assessment.shootingLimitingFactors,
          selected_protocols: assessment.selectedProtocols,
          seven_day_plan: assessment.sevenDayPlan,
          structured_seven_day_plan: assessment.structuredSevenDayPlan,
          written_assessment: assessment.writtenAssessment,
          routing_decision: assessment.routingDecision,
          mentorship_fit_score: assessment.mentorshipFitScore,
          mentorship_notes: assessment.mentorshipNotes,
          is_high_ticket_prospect: assessment.isHighTicketProspect,
          assessment_status: assessment.assessmentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkReady = async () => {
    if (!canMarkReady) {
      alert('Please complete: BB Level, at least 1 protocol, and written assessment (min 50 chars)');
      return;
    }
    setAssessment(prev => ({ ...prev, assessmentStatus: 'ready' }));
    await handleSave();
  };

  // Update profile without sending email (for already delivered evaluations)
  const handleUpdateProfile = async () => {
    if (!confirm('This will update the player\'s profile with your changes. No email will be sent. Continue?')) {
      return;
    }

    setIsUpdating(true);
    try {
      // Save all assessment data to database
      const response = await fetch(`/api/admin/evaluations/${prospectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bb_level: assessment.bbLevel,
          primary_miss: assessment.primaryMiss,
          secondary_miss: assessment.secondaryMiss,
          miss_profile_summary: assessment.missProfileSummary,
          deep_distance_diagnosis: assessment.deepDistanceDiagnosis,
          back_rim_diagnosis: assessment.backRimDiagnosis,
          ball_flight_diagnosis: assessment.ballFlightDiagnosis,
          shooting_limiting_factors: assessment.shootingLimitingFactors,
          selected_protocols: assessment.selectedProtocols,
          seven_day_plan: assessment.sevenDayPlan,
          structured_seven_day_plan: assessment.structuredSevenDayPlan,
          written_assessment: assessment.writtenAssessment,
          routing_decision: assessment.routingDecision,
          mentorship_fit_score: assessment.mentorshipFitScore,
          mentorship_notes: assessment.mentorshipNotes,
          is_high_ticket_prospect: assessment.isHighTicketProspect,
          assessment_status: 'delivered', // Keep as delivered
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      alert('Player profile updated successfully! Changes are now live.');
    } catch (error: any) {
      console.error('Update profile error:', error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeliver = async () => {
    if (!confirm('This will send the evaluation to the player via email. Continue?')) {
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`/api/admin/evaluations/${prospectId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...assessment,
          currentBBLevel: assessment.bbLevel,
          missProfilePrimary: assessment.primaryMiss,
          missProfileSecondary: assessment.secondaryMiss,
          priorityProtocols: assessment.selectedProtocols,
          fullAssessment: assessment.writtenAssessment,
          highTicketProspect: assessment.isHighTicketProspect,
          sevenDayPlan: assessment.sevenDayPlan,
          structuredSevenDayPlan: assessment.structuredSevenDayPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send evaluation');
      }

      setAssessment(prev => ({ ...prev, assessmentStatus: 'delivered' }));
      alert('Evaluation sent successfully! The player will receive an email with their BB Profile.');
      router.push('/admin/evaluations');
    } catch (error: any) {
      console.error('Send evaluation error:', error);
      alert(`Failed to send evaluation: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Loading / Error states
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

  return (
    <main className="min-h-screen bg-bb-black pb-24">
      {/* Sticky Header */}
      <header className="border-b border-bb-border bg-bb-dark/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/evaluations">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-white">{playerName}</h1>
                <p className="text-xs text-gray-400">
                  {formatLevel(evaluation.player_level)} • {evaluation.player_position || 'N/A'} • {evaluation.player_age || 'N/A'}y
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5',
              assessment.assessmentStatus === 'delivered' ? 'bg-green-500/20 text-green-400' :
              assessment.assessmentStatus === 'ready' ? 'bg-blue-500/20 text-blue-400' :
              'bg-orange-500/20 text-orange-400'
            )}>
              {assessment.assessmentStatus === 'delivered' ? <CheckCircle className="w-3.5 h-3.5" /> :
               assessment.assessmentStatus === 'ready' ? <FileText className="w-3.5 h-3.5" /> :
               <AlertCircle className="w-3.5 h-3.5" />}
              {assessment.assessmentStatus.charAt(0).toUpperCase() + assessment.assessmentStatus.slice(1)}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* PANEL 1: Results Snapshot */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-gold-500" />
            Results Snapshot
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 14-Spot Tile */}
            <Card className="bg-bb-card border-bb-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">14-Spot Test</span>
                  {evaluation.fourteen_spot_video_url && (
                    <a href={evaluation.fourteen_spot_video_url} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4 text-gold-500 hover:text-gold-400" />
                    </a>
                  )}
                </div>
                <div className="text-3xl font-bold text-gold-500 mb-1">
                  {avgScore.toFixed(1)}/14
                </div>
                <div className="text-xs text-gray-500">
                  R1: {evaluation.fourteen_spot_round_1_score} | R2: {evaluation.fourteen_spot_round_2_score} | R3: {evaluation.fourteen_spot_round_3_score}
                </div>
                {evaluation.fourteen_spot_round_1_miss_profile && (
                  <div className="mt-2 text-xs text-gray-400">
                    Miss: {evaluation.fourteen_spot_round_1_miss_profile}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deep Distance Tile */}
            <Card className="bg-bb-card border-bb-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Deep Distance</span>
                  {evaluation.deep_distance_video_url && (
                    <a href={evaluation.deep_distance_video_url} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4 text-gold-500 hover:text-gold-400" />
                    </a>
                  )}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {evaluation.deep_distance_steps_behind ?? '-'} steps
                </div>
                <div className="text-xs text-gray-500">Behind 3PT line</div>
              </CardContent>
            </Card>

            {/* Back-Rim Tile */}
            <Card className="bg-bb-card border-bb-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Back-Rim</span>
                  {evaluation.back_rim_video_url && (
                    <a href={evaluation.back_rim_video_url} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4 text-gold-500 hover:text-gold-400" />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{evaluation.back_rim_level_1_shots ?? '-'}</div>
                    <div className="text-xs text-gray-500">L1</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{evaluation.back_rim_level_2_shots ?? '-'}</div>
                    <div className="text-xs text-gray-500">L2</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{evaluation.back_rim_level_3_shots ?? '-'}</div>
                    <div className="text-xs text-gray-500">L3</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ball Flight Tile */}
            <Card className="bg-bb-card border-bb-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Ball Flight</span>
                  {evaluation.ball_flight_video_url && (
                    <a href={evaluation.ball_flight_video_url} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4 text-gold-500 hover:text-gold-400" />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{evaluation.ball_flight_flat_makes ?? '-'}/14</div>
                    <div className="text-xs text-gray-500">Flat</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{evaluation.ball_flight_normal_makes ?? '-'}/14</div>
                    <div className="text-xs text-gray-500">Normal</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{evaluation.ball_flight_high_makes ?? '-'}/14</div>
                    <div className="text-xs text-gray-500">High</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fades Tile */}
            <Card className="bg-bb-card border-bb-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Fades</span>
                  {evaluation.fades_video_url && (
                    <a href={evaluation.fades_video_url} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4 text-gold-500 hover:text-gold-400" />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{evaluation.fade_right_makes ?? '-'}/7</div>
                    <div className="text-xs text-gray-500">Fade R</div>
                    {evaluation.fade_right_miss_profile && (
                      <div className="text-xs text-gray-400 mt-1">{evaluation.fade_right_miss_profile}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{evaluation.fade_left_makes ?? '-'}/7</div>
                    <div className="text-xs text-gray-500">Fade L</div>
                    {evaluation.fade_left_miss_profile && (
                      <div className="text-xs text-gray-400 mt-1">{evaluation.fade_left_miss_profile}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Auto-derived Miss Profile */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Select
              label="Primary Miss (auto-derived, editable)"
              options={missTypeOptions}
              value={assessment.primaryMiss}
              onChange={(v) => setAssessment(prev => ({ ...prev, primaryMiss: v }))}
            />
            <Select
              label="Secondary Miss"
              options={[{ value: '', label: 'None' }, ...missTypeOptions]}
              value={assessment.secondaryMiss}
              onChange={(v) => setAssessment(prev => ({ ...prev, secondaryMiss: v }))}
            />
          </div>

          {/* Player Notes */}
          {evaluation.additional_notes && (
            <div className="mt-4 p-3 bg-bb-dark rounded-lg border border-bb-border">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Player Notes</span>
              <p className="text-sm text-gray-300 mt-1">{evaluation.additional_notes}</p>
            </div>
          )}
        </div>

        {/* Tabs for Panels 2-4 */}
        <div className="flex gap-2 mb-6 border-b border-bb-border pb-2">
          {[
            { id: 'diagnosis', label: 'Diagnosis', icon: Activity },
            { id: 'prescription', label: 'Prescription', icon: Zap },
            { id: 'delivery', label: 'Delivery', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors',
                activePanel === tab.id
                  ? 'bg-bb-card text-gold-500 border border-bb-border border-b-bb-card -mb-[1px]'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* PANEL 2: Diagnosis */}
        {activePanel === 'diagnosis' && (
          <div className="space-y-6">
            {/* Auto-Generate All Button */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gold-500/10 to-transparent rounded-lg border border-gold-500/30">
              <div>
                <p className="text-sm font-medium text-white">Quick Fill</p>
                <p className="text-xs text-gray-400">Auto-generate all diagnosis fields based on player data</p>
              </div>
              <GenerateAllButton
                variables={{
                  playerName: playerName.split(' ')[0],
                  bbLevel: assessment.bbLevel,
                  primaryMiss: assessment.primaryMiss,
                  secondaryMiss: assessment.secondaryMiss,
                  deepDistanceLine: evaluation?.deep_distance_steps_behind,
                  deepDistanceMakes: evaluation?.deep_distance_makes,
                  deepDistanceAttempts: evaluation?.deep_distance_attempts,
                  backRimL1: evaluation?.back_rim_level_1_shots,
                  backRimL2: evaluation?.back_rim_level_2_shots,
                  backRimL3: evaluation?.back_rim_level_3_shots,
                  ballFlight25: evaluation?.ball_flight_flat_makes,
                  ballFlight45: evaluation?.ball_flight_normal_makes,
                  ballFlight60: evaluation?.ball_flight_high_makes,
                  avgScore,
                } as MacroVariables}
                onGenerate={(results) => {
                  setAssessment(prev => ({
                    ...prev,
                    missProfileSummary: results.missProfile,
                    deepDistanceDiagnosis: results.deepDistance,
                    backRimDiagnosis: results.backRim,
                    ballFlightDiagnosis: results.ballFlight,
                  }));
                }}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Diagnosis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* BB Level */}
                <Select
                  label="BB Level"
                  options={bbLevelOptions}
                  value={assessment.bbLevel.toString()}
                  onChange={(v) => setAssessment(prev => ({ ...prev, bbLevel: parseInt(v) }))}
                />

                {/* Miss Profile Summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-200">Miss Profile Summary</label>
                    <MacroDropdown
                      field="missProfile"
                      variables={{
                        playerName: playerName.split(' ')[0],
                        bbLevel: assessment.bbLevel,
                        primaryMiss: assessment.primaryMiss,
                        secondaryMiss: assessment.secondaryMiss,
                      } as MacroVariables}
                      onSelect={(text) => setAssessment(prev => ({ ...prev, missProfileSummary: text }))}
                    />
                  </div>
                  <Textarea
                    value={assessment.missProfileSummary}
                    onChange={(e) => setAssessment(prev => ({ ...prev, missProfileSummary: e.target.value }))}
                    placeholder="Brief summary of good vs bad misses, patterns observed..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Deep Distance Notes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-200">Deep Distance Diagnosis</label>
                    <MacroDropdown
                      field="deepDistance"
                      variables={{
                        playerName: playerName.split(' ')[0],
                        bbLevel: assessment.bbLevel,
                        primaryMiss: assessment.primaryMiss,
                        deepDistanceLine: evaluation?.deep_distance_steps_behind,
                        deepDistanceMakes: evaluation?.deep_distance_makes,
                        deepDistanceAttempts: evaluation?.deep_distance_attempts,
                      } as MacroVariables}
                      onSelect={(text) => setAssessment(prev => ({ ...prev, deepDistanceDiagnosis: text }))}
                    />
                  </div>
                  <Textarea
                    value={assessment.deepDistanceDiagnosis}
                    onChange={(e) => setAssessment(prev => ({ ...prev, deepDistanceDiagnosis: e.target.value }))}
                    placeholder="What the deep distance test suggests + what to focus on..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Back-Rim Notes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-200">Back-Rim Control Diagnosis</label>
                    <MacroDropdown
                      field="backRim"
                      variables={{
                        playerName: playerName.split(' ')[0],
                        bbLevel: assessment.bbLevel,
                        backRimL1: evaluation?.back_rim_level_1_shots,
                        backRimL2: evaluation?.back_rim_level_2_shots,
                        backRimL3: evaluation?.back_rim_level_3_shots,
                      } as MacroVariables}
                      onSelect={(text) => setAssessment(prev => ({ ...prev, backRimDiagnosis: text }))}
                    />
                  </div>
                  <Textarea
                    value={assessment.backRimDiagnosis}
                    onChange={(e) => setAssessment(prev => ({ ...prev, backRimDiagnosis: e.target.value }))}
                    placeholder="What back-rim results suggest + what to focus on..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Ball Flight Notes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-200">Ball Flight Spectrum Notes</label>
                    <MacroDropdown
                      field="ballFlight"
                      variables={{
                        playerName: playerName.split(' ')[0],
                        bbLevel: assessment.bbLevel,
                        ballFlight25: evaluation?.ball_flight_flat_makes,
                        ballFlight45: evaluation?.ball_flight_normal_makes,
                        ballFlight60: evaluation?.ball_flight_high_makes,
                      } as MacroVariables}
                      onSelect={(text) => setAssessment(prev => ({ ...prev, ballFlightDiagnosis: text }))}
                    />
                  </div>
                  <Textarea
                    value={assessment.ballFlightDiagnosis}
                    onChange={(e) => setAssessment(prev => ({ ...prev, ballFlightDiagnosis: e.target.value }))}
                    placeholder="What patterns show + what to explore..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* BB Shooting Limiting Factors */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    BB Shooting Limiting Factors
                  </label>
                  <div className="space-y-3">
                    {shootingLimitingFactorOptions.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-colors',
                          assessment.shootingLimitingFactors.includes(option.value)
                            ? 'bg-gold-500/10 border-gold-500/50'
                            : 'bg-bb-dark border-bb-border hover:border-gray-600'
                        )}
                        onClick={() => {
                          const current = assessment.shootingLimitingFactors;
                          const newFactors = current.includes(option.value)
                            ? current.filter(f => f !== option.value)
                            : [...current, option.value];
                          setAssessment(prev => ({ ...prev, shootingLimitingFactors: newFactors }));
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={assessment.shootingLimitingFactors.includes(option.value)}
                            onChange={() => {}}
                          />
                          <div>
                            <p className="text-sm font-medium text-white">{option.label}</p>
                            <p className="text-xs text-gray-400">{option.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PANEL 3: Prescription */}
        {activePanel === 'prescription' && (
          <div className="space-y-6">
            {/* Priority Protocols */}
            <Card>
              <CardHeader>
                <CardTitle>Top 3 Priority Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">Select up to 3 protocols for their 7-day plan</p>
                <div className="grid gap-2">
                  {protocolOptions.map((option) => {
                    const isSelected = assessment.selectedProtocols.includes(option.value);
                    const isDisabled = assessment.selectedProtocols.length >= 3 && !isSelected;

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-colors',
                          isSelected
                            ? 'bg-gold-500/20 border-gold-500'
                            : isDisabled
                            ? 'bg-bb-dark border-bb-border opacity-50 cursor-not-allowed'
                            : 'bg-bb-dark border-bb-border hover:border-gray-600'
                        )}
                        onClick={() => !isDisabled && handleProtocolToggle(option.value)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox checked={isSelected} onChange={() => {}} />
                          <span className="text-sm text-white">{option.label}</span>
                          {isSelected && (
                            <span className="ml-auto text-xs text-gold-500 font-medium">
                              #{assessment.selectedProtocols.indexOf(option.value) + 1}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 7-Day Implementation Plan Builder */}
            <PlanBuilder
              plan={assessment.structuredSevenDayPlan}
              onChange={(plan) => {
                setAssessment(prev => ({
                  ...prev,
                  structuredSevenDayPlan: plan,
                  // Also update the simple format for backward compatibility
                  sevenDayPlan: planToSimpleFormat(plan) as any,
                }));
              }}
              bbLevel={assessment.bbLevel}
            />

            {/* Mentorship Recommendation */}
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gold-500" />
                  Mentorship Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-bb-dark/50 rounded-lg border border-gold-500/30">
                  <p className="text-sm text-gray-300">
                    <strong className="text-gold-500">Note:</strong> Strobes + oversized ball amplify implementation significantly.
                    High-fit prospects should be offered the 3-month mentorship (~$5,000).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Fit Score (1-10)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={assessment.mentorshipFitScore}
                    onChange={(e) => setAssessment(prev => ({
                      ...prev,
                      mentorshipFitScore: parseInt(e.target.value) || 5,
                    }))}
                  />
                </div>

                <Textarea
                  label="Mentorship Notes (internal)"
                  value={assessment.mentorshipNotes}
                  onChange={(e) => setAssessment(prev => ({ ...prev, mentorshipNotes: e.target.value }))}
                  placeholder="Why would this player benefit from 3-month mentorship? Level of commitment, coachability..."
                />

                <Checkbox
                  checked={assessment.isHighTicketProspect}
                  onChange={(checked) => setAssessment(prev => ({ ...prev, isHighTicketProspect: checked }))}
                  label="Mark as High-Ticket Prospect"
                  description="Player will see 'Schedule a call' CTA after delivery"
                />
              </CardContent>
            </Card>

            {/* Routing Decision */}
            <Card>
              <CardHeader>
                <CardTitle>Next-Step Routing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {routingOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer transition-colors',
                        assessment.routingDecision === option.value
                          ? 'bg-gold-500/20 border-gold-500'
                          : 'bg-bb-dark border-bb-border hover:border-gray-600'
                      )}
                      onClick={() => setAssessment(prev => ({ ...prev, routingDecision: option.value }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-4 h-4 rounded-full border-2',
                          assessment.routingDecision === option.value
                            ? 'border-gold-500 bg-gold-500'
                            : 'border-gray-500'
                        )} />
                        <div>
                          <p className="text-sm font-medium text-white">{option.label}</p>
                          <p className="text-xs text-gray-400">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PANEL 4: Delivery */}
        {activePanel === 'delivery' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Player-Facing Written Assessment</span>
                  <Button variant="secondary" size="sm" onClick={handleGenerateAssessment}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Auto-Generate
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  This is what the player receives. Click auto-generate then polish as needed.
                </p>
                <Textarea
                  value={assessment.writtenAssessment}
                  onChange={(e) => setAssessment(prev => ({ ...prev, writtenAssessment: e.target.value }))}
                  placeholder="Click 'Auto-Generate' to create the assessment from your diagnosis and prescription..."
                  className="min-h-[400px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {assessment.writtenAssessment.length} characters
                  {assessment.writtenAssessment.length < 50 && ' (min 50 required)'}
                </p>
              </CardContent>
            </Card>

            {/* Preview Summary */}
            <Card className="bg-bb-dark">
              <CardHeader>
                <CardTitle>Delivery Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">BB Level</span>
                  <span className="text-white font-medium">Level {assessment.bbLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Primary Miss</span>
                  <span className="text-white font-medium capitalize">{assessment.primaryMiss}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Protocols</span>
                  <span className="text-white font-medium">{assessment.selectedProtocols.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">7-Day Plan</span>
                  <span className="text-green-400 font-medium">Ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Routing</span>
                  <span className="text-white font-medium capitalize">{assessment.routingDecision.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">High-Ticket</span>
                  <span className={cn('font-medium', assessment.isHighTicketProspect ? 'text-gold-500' : 'text-gray-500')}>
                    {assessment.isHighTicketProspect ? 'Yes' : 'No'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Sticky Fulfillment Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bb-dark/95 backdrop-blur-lg border-t border-bb-border z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Status</p>
                <p className={cn(
                  'text-sm font-semibold',
                  assessment.assessmentStatus === 'delivered' ? 'text-green-400' :
                  assessment.assessmentStatus === 'ready' ? 'text-blue-400' :
                  'text-orange-400'
                )}>
                  {assessment.assessmentStatus.charAt(0).toUpperCase() + assessment.assessmentStatus.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Player Email</p>
                <p className="text-sm text-white">{evaluation.prospects?.email || 'N/A'}</p>
              </div>
              {assessment.isHighTicketProspect && (
                <div className="px-3 py-1 bg-gold-500/20 rounded-full">
                  <span className="text-xs font-semibold text-gold-500 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    High-Ticket Prospect
                  </span>
                </div>
              )}
              {assessment.assessmentStatus === 'delivered' && (
                <a
                  href={`https://bb-platform-virid.vercel.app/portal/${prospectId}/profile`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
                >
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    View Player Profile
                  </span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>

              {assessment.assessmentStatus === 'draft' && (
                <Button
                  variant="secondary"
                  onClick={handleMarkReady}
                  disabled={!canMarkReady}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Ready
                </Button>
              )}

              {assessment.assessmentStatus === 'delivered' && (
                <Button
                  variant="secondary"
                  onClick={handleUpdateProfile}
                  disabled={isUpdating || !canMarkReady}
                >
                  <RefreshCw className={cn("w-4 h-4 mr-2", isUpdating && "animate-spin")} />
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              )}

              <Button
                onClick={handleDeliver}
                disabled={isSending || !canMarkReady}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : assessment.assessmentStatus === 'delivered' ? 'Re-Deliver' : 'Deliver to Player'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
