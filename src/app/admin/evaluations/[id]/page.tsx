'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Video,
  Save,
  Send,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatLevel } from '@/lib/utils';
import type { MissType } from '@/types';

// Mock data - in production this would come from API
const mockEvaluation = {
  id: '1',
  prospect: {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    playerLevel: 'high_school',
    playerPosition: 'SG',
    playerAge: 17,
    playerHeight: "6'2\"",
    threePtPercentage: 35,
    ftPercentage: 72,
    primaryStruggles: ['distance', 'consistency'],
    deepDistanceBreakdown: 'I can hit from the college 3 but the NBA line feels impossible',
    goals: 'Extend my range to NBA 3 and become more consistent in games',
    commitmentLevel: 'serious',
  },
  testResults: {
    fourteenSpot: {
      makes: 8,
      backRim: 2,
      short: 3,
      left: 1,
    },
    deepDistance: {
      distanceBehindLine: 4,
      rimContacts: 6,
      shortMisses: 4,
      total: 10,
    },
    backRim: {
      bestConsecutive: 2,
      spots: [
        { name: 'Left Wing', best: 2 },
        { name: 'Top', best: 1 },
        { name: 'Right Wing', best: 2 },
      ],
    },
  },
  videoUrl: 'https://drive.google.com/drive/folders/example',
  status: 'pending',
};

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
  const evaluationId = params.id as string;

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

  const data = mockEvaluation;

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
              Evaluation: {data.prospect.firstName} {data.prospect.lastName}
            </h1>
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
                    <p className="text-white font-medium">
                      {data.prospect.firstName} {data.prospect.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Level</span>
                    <p className="text-white font-medium">
                      {formatLevel(data.prospect.playerLevel)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Age / Height</span>
                    <p className="text-white font-medium">
                      {data.prospect.playerAge} / {data.prospect.playerHeight}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Position</span>
                    <p className="text-white font-medium">
                      {data.prospect.playerPosition}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">3PT%</span>
                    <p className="text-white font-medium">
                      {data.prospect.threePtPercentage}%
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">FT%</span>
                    <p className="text-white font-medium">
                      {data.prospect.ftPercentage}%
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-bb-border">
                  <span className="text-gray-400 text-sm">Primary Struggles</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.prospect.primaryStruggles.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">
                    Where shot breaks down
                  </span>
                  <p className="text-white text-sm mt-1">
                    {data.prospect.deepDistanceBreakdown}
                  </p>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Goals</span>
                  <p className="text-white text-sm mt-1">{data.prospect.goals}</p>
                </div>
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
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-green-500/20 rounded">
                      <p className="text-xl font-bold text-green-500">
                        {data.testResults.fourteenSpot.makes}
                      </p>
                      <p className="text-xs text-gray-400">Makes</p>
                    </div>
                    <div className="p-2 bg-gold-500/20 rounded">
                      <p className="text-xl font-bold text-gold-500">
                        {data.testResults.fourteenSpot.backRim}
                      </p>
                      <p className="text-xs text-gray-400">Back Rim</p>
                    </div>
                    <div className="p-2 bg-red-500/20 rounded">
                      <p className="text-xl font-bold text-red-500">
                        {data.testResults.fourteenSpot.short}
                      </p>
                      <p className="text-xs text-gray-400">Short</p>
                    </div>
                    <div className="p-2 bg-blue-500/20 rounded">
                      <p className="text-xl font-bold text-blue-500">
                        {data.testResults.fourteenSpot.left}
                      </p>
                      <p className="text-xs text-gray-400">Left/Right</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {data.testResults.fourteenSpot.makes}/14 makes
                    {data.testResults.fourteenSpot.makes >= 10
                      ? ' ✓ Passes Level 1'
                      : ' ✗ Does not pass Level 1'}
                  </p>
                </div>

                {/* Deep Distance */}
                <div>
                  <h4 className="text-sm font-medium text-gold-400 mb-2">
                    Deep Distance Test
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    {data.testResults.deepDistance.distanceBehindLine}ft behind
                    the line
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-gold-500/20 rounded">
                      <p className="text-xl font-bold text-gold-500">
                        {data.testResults.deepDistance.rimContacts}
                      </p>
                      <p className="text-xs text-gray-400">Rim Contacts</p>
                    </div>
                    <div className="p-2 bg-red-500/20 rounded">
                      <p className="text-xl font-bold text-red-500">
                        {data.testResults.deepDistance.shortMisses}
                      </p>
                      <p className="text-xs text-gray-400">Short</p>
                    </div>
                    <div className="p-2 bg-bb-border rounded">
                      <p className="text-xl font-bold text-white">
                        {data.testResults.deepDistance.total}
                      </p>
                      <p className="text-xs text-gray-400">Total</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {data.testResults.deepDistance.rimContacts}/10 rim contacts
                    {data.testResults.deepDistance.rimContacts >= 8
                      ? ' ✓ Passes Level 2'
                      : ' ✗ Does not pass Level 2'}
                  </p>
                </div>

                {/* Back Rim */}
                <div>
                  <h4 className="text-sm font-medium text-gold-400 mb-2">
                    Back-Rim Challenge
                  </h4>
                  <div className="space-y-1">
                    {data.testResults.backRim.spots.map((spot) => (
                      <div
                        key={spot.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-400">{spot.name}</span>
                        <span
                          className={cn(
                            'font-medium',
                            spot.best >= 3 ? 'text-green-500' : 'text-gray-400'
                          )}
                        >
                          Best: {spot.best}{' '}
                          {spot.best >= 3 && '✓'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Best consecutive: {data.testResults.backRim.bestConsecutive}
                    {data.testResults.backRim.bestConsecutive >= 3
                      ? ' ✓ Passes Level 2'
                      : ' ✗ Does not pass Level 2'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Video link */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-gold-500" />
                  Video Footage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={data.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gold-500 hover:text-gold-400 transition-colors"
                >
                  Open Google Drive Folder
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
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
