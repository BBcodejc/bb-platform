'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  RefreshCw,
  Target,
  Flame,
  Zap,
  Trophy,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  Star,
  TrendingUp,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SevenDayPlanView } from '@/components/player/SevenDayPlanView';
import { type StructuredSevenDayPlan, type DayLog } from '@/lib/seven-day-plan';
import { cn } from '@/lib/utils';

interface ProfileData {
  playerName: string;
  bbLevel: number;
  playerLevel: string;
  fourteenSpotScores: {
    round1: number;
    round2: number;
    round3: number;
    total: number;
  };
  deepDistance: {
    line: number;
    makes: number;
    attempts: number;
  };
  ballFlight: {
    flat: number;
    normal: number;
    high: number;
  };
  fades: {
    right: number;
    left: number;
  };
  backRim: {
    level1: number;
    level2: number;
    level3: number;
  };
  missProfileSummary: string;
  deepDistanceDiagnosis: string;
  backRimDiagnosis: string;
  ballFlightDiagnosis: string;
  writtenAssessment: string;
  structuredSevenDayPlan: StructuredSevenDayPlan | null;
  playerPlanLogs: DayLog[];
}

const bbLevelOptions = [
  { value: '1', label: 'BB 1 - Foundation' },
  { value: '2', label: 'BB 2 - Developing' },
  { value: '3', label: 'BB 3 - Advanced' },
  { value: '4', label: 'BB 4 - Elite' },
];

export default function PlayerProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const prospectId = params.id as string;
  const isAdminEdit = searchParams.get('edit') === 'true';

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showFullPlan, setShowFullPlan] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Editable fields
  const [editData, setEditData] = useState({
    bbLevel: 1,
    writtenAssessment: '',
    missProfileSummary: '',
    deepDistanceDiagnosis: '',
    backRimDiagnosis: '',
    ballFlightDiagnosis: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`/api/portal/${prospectId}/profile`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Profile not available yet');
        }

        setProfileData(data);
        // Initialize edit data
        setEditData({
          bbLevel: data.bbLevel || 1,
          writtenAssessment: data.writtenAssessment || '',
          missProfileSummary: data.missProfileSummary || '',
          deepDistanceDiagnosis: data.deepDistanceDiagnosis || '',
          backRimDiagnosis: data.backRimDiagnosis || '',
          ballFlightDiagnosis: data.ballFlightDiagnosis || '',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [prospectId]);

  // Admin save function
  const handleAdminSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/evaluations/${prospectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bb_level: editData.bbLevel,
          written_assessment: editData.writtenAssessment,
          miss_profile_summary: editData.missProfileSummary,
          deep_distance_diagnosis: editData.deepDistanceDiagnosis,
          back_rim_diagnosis: editData.backRimDiagnosis,
          ball_flight_diagnosis: editData.ballFlightDiagnosis,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      // Update profile data with edited values
      setProfileData(prev => prev ? {
        ...prev,
        bbLevel: editData.bbLevel,
        writtenAssessment: editData.writtenAssessment,
        missProfileSummary: editData.missProfileSummary,
        deepDistanceDiagnosis: editData.deepDistanceDiagnosis,
        backRimDiagnosis: editData.backRimDiagnosis,
        ballFlightDiagnosis: editData.ballFlightDiagnosis,
      } : null);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setIsEditMode(false);
    } catch (err) {
      console.error('Admin save error:', err);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profileData) {
      setEditData({
        bbLevel: profileData.bbLevel,
        writtenAssessment: profileData.writtenAssessment,
        missProfileSummary: profileData.missProfileSummary,
        deepDistanceDiagnosis: profileData.deepDistanceDiagnosis,
        backRimDiagnosis: profileData.backRimDiagnosis,
        ballFlightDiagnosis: profileData.ballFlightDiagnosis,
      });
    }
    setIsEditMode(false);
  };

  const handleLogUpdate = async (logs: DayLog[]) => {
    if (!profileData) return;

    setProfileData(prev => prev ? { ...prev, playerPlanLogs: logs } : null);

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/portal/${prospectId}/plan`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerPlanLogs: logs }),
      });

      if (!response.ok) throw new Error('Failed to save');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getBBLevelColor = (level: number) => {
    if (level >= 4) return 'from-green-500 to-emerald-600';
    if (level >= 3) return 'from-blue-500 to-cyan-600';
    if (level >= 2) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getBBLevelText = (level: number) => {
    if (level >= 4) return 'Elite Shooter';
    if (level >= 3) return 'Advanced';
    if (level >= 2) return 'Developing';
    return 'Foundation';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
      </main>
    );
  }

  if (error || !profileData) {
    return (
      <main className="min-h-screen bg-bb-black">
        <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image
                  src="/players/bb-logo.png"
                  alt="BB"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </Link>
              <span className="text-gold-500 font-bold tracking-wider text-xs">
                BB PLAYER PROFILE
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <div className="bg-bb-card border border-bb-border rounded-xl p-8">
            <h1 className="text-xl font-bold text-white mb-4">Profile Not Available Yet</h1>
            <p className="text-gray-400 mb-6">
              Your evaluation results will appear here once complete. We'll email you when it's ready!
            </p>
          </div>
        </div>
      </main>
    );
  }

  const {
    playerName,
    bbLevel,
    fourteenSpotScores,
    deepDistance,
    ballFlight,
    fades,
    backRim,
    missProfileSummary,
    deepDistanceDiagnosis,
    backRimDiagnosis,
    ballFlightDiagnosis,
    writtenAssessment,
    structuredSevenDayPlan,
    playerPlanLogs,
  } = profileData;

  const completedDays = playerPlanLogs.filter(log => log.completed).length;

  return (
    <main className="min-h-screen bg-bb-black pb-8">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image
                  src="/players/bb-logo.png"
                  alt="BB"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </Link>
              <div>
                <span className="text-gold-500 font-bold tracking-wider text-xs block">
                  BB PLAYER PROFILE
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isSaving && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Saving...
                </span>
              )}
              {saveSuccess && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Saved
                </span>
              )}
              {/* Admin Edit Controls */}
              {isAdminEdit && !isEditMode && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsEditMode(true)}
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
              {isAdminEdit && isEditMode && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAdminSave}
                    disabled={isSaving}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with BB Level */}
      <div className={cn(
        'bg-gradient-to-br py-8 border-b border-bb-border',
        getBBLevelColor(isEditMode ? editData.bbLevel : bbLevel)
      )}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{playerName}</h1>
              <p className="text-white/80 text-sm">{getBBLevelText(isEditMode ? editData.bbLevel : bbLevel)}</p>
            </div>
            <div className="text-right">
              {isEditMode ? (
                <select
                  value={editData.bbLevel}
                  onChange={(e) => setEditData(prev => ({ ...prev, bbLevel: parseInt(e.target.value) }))}
                  className="bg-white/20 text-white text-3xl font-black rounded-lg px-4 py-2 border border-white/30"
                >
                  <option value={1} className="text-black">BB 1</option>
                  <option value={2} className="text-black">BB 2</option>
                  <option value={3} className="text-black">BB 3</option>
                  <option value={4} className="text-black">BB 4</option>
                </select>
              ) : (
                <div className="text-5xl font-black text-white">BB {bbLevel}</div>
              )}
              <p className="text-white/60 text-xs mt-1">Shooting Level</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Results Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-gold-500" />
              Results Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 14-Spot */}
              <div className="bg-bb-dark rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">14-Spot Average</p>
                <p className="text-2xl font-bold text-white">
                  {fourteenSpotScores.total}
                  <span className="text-sm text-gray-500">/14</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {fourteenSpotScores.round1}, {fourteenSpotScores.round2}, {fourteenSpotScores.round3}
                </p>
              </div>

              {/* Deep Distance */}
              <div className="bg-bb-dark rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Deep Distance</p>
                <p className="text-2xl font-bold text-white">
                  {deepDistance.line}
                  <span className="text-sm text-gray-500"> steps</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Behind 3PT line
                </p>
              </div>

              {/* Ball Flight */}
              <div className="bg-bb-dark rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Ball Flight</p>
                <p className="text-2xl font-bold text-white">
                  {ballFlight.flat + ballFlight.normal + ballFlight.high}
                  <span className="text-sm text-gray-500">/42</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {ballFlight.flat}/14 | {ballFlight.normal}/14 | {ballFlight.high}/14
                </p>
              </div>

              {/* Fades */}
              <div className="bg-bb-dark rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Fades</p>
                <p className="text-2xl font-bold text-white">
                  {fades.right + fades.left}
                  <span className="text-sm text-gray-500">/14</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  R: {fades.right}/7 | L: {fades.left}/7
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Written Assessment */}
        {(writtenAssessment || isEditMode) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-gold-500" />
                Your Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <Textarea
                  value={editData.writtenAssessment}
                  onChange={(e) => setEditData(prev => ({ ...prev, writtenAssessment: e.target.value }))}
                  className="min-h-[200px]"
                  placeholder="Enter player assessment..."
                />
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {writtenAssessment}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Diagnosis Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {(missProfileSummary || isEditMode) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Miss Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditMode ? (
                  <Textarea
                    value={editData.missProfileSummary}
                    onChange={(e) => setEditData(prev => ({ ...prev, missProfileSummary: e.target.value }))}
                    className="min-h-[80px]"
                    placeholder="Miss profile summary..."
                  />
                ) : (
                  <p className="text-white text-sm">{missProfileSummary}</p>
                )}
              </CardContent>
            </Card>
          )}

          {(deepDistanceDiagnosis || isEditMode) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Deep Distance</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditMode ? (
                  <Textarea
                    value={editData.deepDistanceDiagnosis}
                    onChange={(e) => setEditData(prev => ({ ...prev, deepDistanceDiagnosis: e.target.value }))}
                    className="min-h-[80px]"
                    placeholder="Deep distance diagnosis..."
                  />
                ) : (
                  <p className="text-white text-sm">{deepDistanceDiagnosis}</p>
                )}
              </CardContent>
            </Card>
          )}

          {(backRimDiagnosis || isEditMode) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Back-Rim Control</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditMode ? (
                  <Textarea
                    value={editData.backRimDiagnosis}
                    onChange={(e) => setEditData(prev => ({ ...prev, backRimDiagnosis: e.target.value }))}
                    className="min-h-[80px]"
                    placeholder="Back-rim control diagnosis..."
                  />
                ) : (
                  <p className="text-white text-sm">{backRimDiagnosis}</p>
                )}
              </CardContent>
            </Card>
          )}

          {(ballFlightDiagnosis || isEditMode) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Ball Flight</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditMode ? (
                  <Textarea
                    value={editData.ballFlightDiagnosis}
                    onChange={(e) => setEditData(prev => ({ ...prev, ballFlightDiagnosis: e.target.value }))}
                    className="min-h-[80px]"
                    placeholder="Ball flight diagnosis..."
                  />
                ) : (
                  <p className="text-white text-sm">{ballFlightDiagnosis}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* 7-Day Implementation Plan */}
        {structuredSevenDayPlan && (
          <Card className="border-gold-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Your 7-Day Implementation Plan
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {completedDays}/7 days
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }, (_, i) => {
                      const isCompleted = playerPlanLogs.some(log => log.day === i + 1 && log.completed);
                      return (
                        <div
                          key={i}
                          className={cn(
                            'w-4 h-4 rounded-full flex items-center justify-center',
                            isCompleted ? 'bg-green-500/30 text-green-400' : 'bg-gray-700/50'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Circle className="w-2 h-2 text-gray-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {structuredSevenDayPlan.presetName}
              </p>
            </CardHeader>
            <CardContent>
              {/* Non-Negotiable Rule */}
              {structuredSevenDayPlan.nonNegotiableRule && (
                <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 mb-6">
                  <h4 className="text-gold-500 font-semibold text-sm mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Non-Negotiable Rule
                  </h4>
                  <p className="text-sm text-gray-300">{structuredSevenDayPlan.nonNegotiableRule}</p>
                  {structuredSevenDayPlan.goal && (
                    <p className="text-xs text-gray-500 mt-2">Goal: {structuredSevenDayPlan.goal}</p>
                  )}
                </div>
              )}

              {/* Toggle Full Plan */}
              <Button
                variant="outline"
                onClick={() => setShowFullPlan(!showFullPlan)}
                className="w-full mb-4"
              >
                {showFullPlan ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Hide Full Workout Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show Full Workout Details
                  </>
                )}
              </Button>

              {/* Full Plan View */}
              {showFullPlan && (
                <SevenDayPlanView
                  plan={structuredSevenDayPlan}
                  logs={playerPlanLogs}
                  onLogUpdate={handleLogUpdate}
                  readOnly={false}
                />
              )}

              {/* Quick Day Overview */}
              {!showFullPlan && (
                <div className="space-y-2">
                  {structuredSevenDayPlan.schedule.map((scheduleItem) => {
                    const log = playerPlanLogs.find(l => l.day === scheduleItem.day);
                    const isCompleted = log?.completed;

                    return (
                      <div
                        key={scheduleItem.day}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg border transition-colors',
                          isCompleted
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-bb-dark border-bb-border'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                            isCompleted ? 'bg-green-500 text-white' : 'bg-bb-border text-gray-400'
                          )}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : scheduleItem.day}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              Day {scheduleItem.day}: Session {scheduleItem.session}
                            </p>
                            <p className="text-xs text-gray-500">
                              {scheduleItem.session === 'A' && 'Deep Distance + Back Rim'}
                              {scheduleItem.session === 'B' && 'Ball Flight Spectrum'}
                              {scheduleItem.session === 'C' && 'Fades'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Protocols Link */}
        <Card className="bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold mb-1">Need More Workouts?</h3>
                <p className="text-gray-400 text-sm">Access our full library of shooting protocols</p>
              </div>
              <Link href="/protocols">
                <Button>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Protocols
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
