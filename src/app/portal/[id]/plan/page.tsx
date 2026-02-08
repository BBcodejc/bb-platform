'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SevenDayPlanView } from '@/components/player/SevenDayPlanView';
import { type StructuredSevenDayPlan, type DayLog } from '@/lib/seven-day-plan';

interface PlanData {
  playerName: string;
  bbLevel: number;
  structuredSevenDayPlan: StructuredSevenDayPlan | null;
  playerPlanLogs: DayLog[];
  status: string;
}

export default function PlayerPlanPage() {
  const params = useParams();
  const prospectId = params.id as string;

  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await fetch(`/api/portal/${prospectId}/plan`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Plan not available yet');
        }

        setPlanData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [prospectId]);

  const handleLogUpdate = async (logs: DayLog[]) => {
    if (!planData) return;

    setPlanData(prev => prev ? { ...prev, playerPlanLogs: logs } : null);

    // Auto-save after a short delay
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/portal/${prospectId}/plan`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerPlanLogs: logs }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
      </main>
    );
  }

  if (error || !planData) {
    return (
      <main className="min-h-screen bg-bb-black">
        <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 py-3">
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
                BB TRAINING PLAN
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-bb-card border border-bb-border rounded-xl p-8">
            <h1 className="text-xl font-bold text-white mb-4">Plan Not Available Yet</h1>
            <p className="text-gray-400 mb-6">
              {error === 'Plan not available yet'
                ? "Your personalized 7-day plan will appear here once your evaluation is complete. We'll email you when it's ready!"
                : error || 'Unable to load your plan.'}
            </p>
            <Link href="/protocols">
              <Button>Browse General Protocols</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { structuredSevenDayPlan, playerPlanLogs, playerName, bbLevel } = planData;

  if (!structuredSevenDayPlan) {
    return (
      <main className="min-h-screen bg-bb-black">
        <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 py-3">
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
                BB TRAINING PLAN
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-bb-card border border-bb-border rounded-xl p-8">
            <h1 className="text-xl font-bold text-white mb-4">Evaluation In Progress</h1>
            <p className="text-gray-400 mb-6">
              Your personalized 7-day implementation plan is being created. Check back soon or wait for our email!
            </p>
            <Link href="/protocols">
              <Button>Browse General Protocols</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bb-black pb-20">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
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
                  BB TRAINING PLAN
                </span>
                <span className="text-xs text-gray-500">
                  {playerName} • Level {bbLevel}
                </span>
              </div>
            </div>

            {/* Save Status */}
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
            </div>
          </div>
        </div>
      </header>

      {/* Player Info Banner */}
      <div className="bg-gradient-to-r from-gold-500/10 to-transparent border-b border-gold-500/20">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white">{playerName}'s 7-Day Plan</h1>
              <p className="text-xs text-gray-400">BB Level {bbLevel} • {structuredSevenDayPlan.presetName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Track your progress below</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan View */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <SevenDayPlanView
          plan={structuredSevenDayPlan}
          logs={playerPlanLogs}
          onLogUpdate={handleLogUpdate}
          readOnly={false}
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bb-dark/95 backdrop-blur-lg border-t border-bb-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/protocols" className="text-sm text-gray-400 hover:text-gold-500">
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              All Protocols
            </Link>
            <p className="text-xs text-gray-500">
              Progress auto-saves as you log
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
