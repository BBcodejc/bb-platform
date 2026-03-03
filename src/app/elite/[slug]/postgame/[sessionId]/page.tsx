'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  X,
  Target,
  TrendingUp,
  BarChart3,
  Loader2,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Label maps for display
const LABEL_MAP: Record<string, Record<string, string>> = {
  shotType: {
    'catch-and-shoot': 'Catch & Shoot',
    'pull-up': 'Pull-Up',
    'off-screen': 'Off Screen',
    'post-fade': 'Post Fade',
    'step-back': 'Step Back',
    'floater': 'Floater',
    'other': 'Other',
  },
  missType: {
    'left': 'Left',
    'right': 'Right',
    'short': 'Short',
    'long': 'Long',
    'back-rim': 'Back Rim',
    'front-rim': 'Front Rim',
    'air-ball': 'Air Ball',
    'blocked': 'Blocked',
  },
  timeToShot: {
    '0.5_or_less': '0.5s or less',
    '0.5_to_0.8': '0.5 – 0.8s',
    '0.8_plus': '0.8s+',
  },
  energyPattern: {
    'subtle_drift': 'Subtle Drift',
    'very_little_drift': 'Very Little Drift',
    'fade': 'Fade',
  },
  ballPattern: {
    'dip': 'Dip',
    'no_dip': 'No Dip',
    'large_dip': 'Large Dip',
    'compact_dip': 'Compact Dip',
  },
  followThrough: {
    'no_hold': 'No Hold',
    'hold': 'Hold',
  },
  alignment: {
    'square_to_rim': 'Square to Rim',
    'bias_angled_left': 'Bias Angled Left',
  },
};

function getLabel(category: string, value: string): string {
  return LABEL_MAP[category]?.[value] || value;
}

interface Shot {
  id: string;
  shotNumber: number;
  result: 'make' | 'miss';
  shotType: string;
  missType: string;
  timeToShot: string;
  energyPattern: string;
  ballPattern: string;
  followThrough: string;
  alignment: string;
  notes: string;
}

interface SessionData {
  player: {
    firstName: string;
    lastName: string;
    team: string;
    position: string;
    slug: string;
  };
  session: {
    id: string;
    date: string;
    title: string;
    opponent: string;
    notes: string;
    createdBy: string;
  };
  shots: Shot[];
}

export default function PostGameReportPage() {
  const params = useParams();
  const slug = params.slug as string;
  const sessionId = params.sessionId as string;

  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [slug, sessionId]);

  async function fetchReport() {
    try {
      setLoading(true);
      const res = await fetch(`/api/elite-players/${slug}/postgame/${sessionId}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Report not found</p>
        </div>
      </div>
    );
  }

  const { player, session, shots } = data;
  const totalShots = shots.length;
  const makes = shots.filter(s => s.result === 'make').length;
  const misses = totalShots - makes;
  const makePct = totalShots > 0 ? ((makes / totalShots) * 100).toFixed(1) : '0.0';

  // Category breakdowns
  function getCategoryBreakdown(field: keyof Shot, labelCategory: string) {
    const counts: Record<string, number> = {};
    shots.forEach(s => {
      const val = s[field] as string;
      if (val) {
        counts[val] = (counts[val] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([value, count]) => ({
        label: getLabel(labelCategory, value),
        count,
        pct: ((count / totalShots) * 100).toFixed(0),
      }));
  }

  const gameDate = new Date(session.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Post-Game Analysis</p>
              <h1 className="text-xl font-bold">
                {player.firstName} {player.lastName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>vs {session.opponent}</span>
            <span className="text-gray-600">|</span>
            <span>{gameDate}</span>
            {session.createdBy && (
              <>
                <span className="text-gray-600">|</span>
                <span>{session.createdBy}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center p-5 rounded-2xl bg-[#111] border border-[#1A1A1A]">
            <p className="text-3xl font-bold text-white">{totalShots}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Total Shots</p>
          </div>
          <div className="text-center p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
            <p className="text-3xl font-bold text-green-400">{makes}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Makes</p>
          </div>
          <div className="text-center p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
            <p className="text-3xl font-bold text-red-400">{misses}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Misses</p>
          </div>
          <div className="text-center p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-3xl font-bold text-amber-400">{makePct}%</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Make Rate</p>
          </div>
        </div>

        {/* Pattern Analysis Grid */}
        {totalShots > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Shot Types */}
            {shots.some(s => s.shotType) && (
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1A1A1A]">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shot Types</h3>
                <div className="space-y-2">
                  {getCategoryBreakdown('shotType', 'shotType').map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Energy Pattern */}
            {shots.some(s => s.energyPattern) && (
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1A1A1A]">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Energy Pattern</h3>
                <div className="space-y-2">
                  {getCategoryBreakdown('energyPattern', 'energyPattern').map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-400">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ball Pattern */}
            {shots.some(s => s.ballPattern) && (
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1A1A1A]">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ball Pattern</h3>
                <div className="space-y-2">
                  {getCategoryBreakdown('ballPattern', 'ballPattern').map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-purple-400">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time to Shot */}
            {shots.some(s => s.timeToShot) && (
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1A1A1A]">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Time to Shot</h3>
                <div className="space-y-2">
                  {getCategoryBreakdown('timeToShot', 'timeToShot').map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-amber-400">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow Through */}
            {shots.some(s => s.followThrough) && (
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1A1A1A]">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Follow Through</h3>
                <div className="space-y-2">
                  {getCategoryBreakdown('followThrough', 'followThrough').map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-emerald-400">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alignment */}
            {shots.some(s => s.alignment) && (
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1A1A1A]">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Alignment</h3>
                <div className="space-y-2">
                  {getCategoryBreakdown('alignment', 'alignment').map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-orange-400">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Miss Types (only show if misses exist) */}
            {misses > 0 && shots.some(s => s.missType) && (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Miss Types</h3>
                <div className="space-y-2">
                  {getCategoryBreakdown('missType', 'missType').map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-red-400">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shot-by-Shot Detail */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Shot-by-Shot Detail</h2>
          <div className="space-y-2">
            {shots.map((shot) => (
              <div
                key={shot.id}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl border',
                  shot.result === 'make'
                    ? 'bg-green-500/5 border-green-500/15'
                    : 'bg-red-500/5 border-red-500/15'
                )}
              >
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-500">#{shot.shotNumber}</span>
                  <span className={cn(
                    'text-xs font-bold px-2.5 py-1 rounded-full',
                    shot.result === 'make'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  )}>
                    {shot.result === 'make' ? (
                      <><Check className="w-3 h-3 inline mr-0.5" />MAKE</>
                    ) : (
                      <><X className="w-3 h-3 inline mr-0.5" />MISS</>
                    )}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {shot.shotType && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {getLabel('shotType', shot.shotType)}
                      </span>
                    )}
                    {shot.result === 'miss' && shot.missType && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        {getLabel('missType', shot.missType)}
                      </span>
                    )}
                    {shot.timeToShot && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
                        {getLabel('timeToShot', shot.timeToShot)}
                      </span>
                    )}
                    {shot.energyPattern && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {getLabel('energyPattern', shot.energyPattern)}
                      </span>
                    )}
                    {shot.ballPattern && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {getLabel('ballPattern', shot.ballPattern)}
                      </span>
                    )}
                    {shot.followThrough && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {getLabel('followThrough', shot.followThrough)}
                      </span>
                    )}
                    {shot.alignment && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        {getLabel('alignment', shot.alignment)}
                      </span>
                    )}
                  </div>
                  {shot.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic">{shot.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1A1A1A] pt-6 pb-12">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
            <Target className="w-3.5 h-3.5" />
            <span>Basketball Biomechanics</span>
          </div>
        </div>
      </main>
    </div>
  );
}
