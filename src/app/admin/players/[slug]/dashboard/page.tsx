'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, FadeIn } from '@/components/ui/motion';
import { useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Play,
  Calendar,
  Film,
  ClipboardList,
  MessageSquare,
  Crosshair,
  User,
  RefreshCw,
  Edit,
  Flame,
  Snowflake,
  Minus,
  Trophy,
  Zap,
  Target,
} from 'lucide-react';
import type {
  PlayerDashboardData,
  SeasonStats,
  BBMetrics,
  GameScoutingReport,
  PlayerStats,
  Highlight,
  AutoHighlight,
  DashboardClip,
  VideoClip,
} from '@/types/elite-player';

// ============================================================
// COUNT-UP ANIMATION COMPONENT
// ============================================================
function CountUp({
  target,
  decimals = 1,
  duration = 1,
  prefix = '',
  suffix = '',
  className,
}: {
  target: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !target) return;
    let start = 0;
    const step = target / (duration * 60);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setDisplay(start.toFixed(decimals));
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [inView, target, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// ============================================================
// ANIMATED SHOOTING SPLIT BAR
// ============================================================
function ShootingSplitBar({
  label,
  value,
  max = 100,
  delay = 0,
}: {
  label: string;
  value: number;
  max?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-[11px] text-gray-400 uppercase tracking-wider w-20 flex-shrink-0 text-right">
        {label}
      </span>
      <div className="flex-1 h-3 rounded-full bg-[#1A1A1A] overflow-hidden relative">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#9A7B3C] via-[#C9A961] to-[#E8D5A3]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay }}
        />
      </div>
      <span className="text-sm font-bold text-white font-barlow w-14 text-right">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

// ============================================================
// RADAR / HEXAGON CHART (SVG)
// ============================================================
function RadarChart({
  data,
  slug,
}: {
  data: { label: string; value: number }[];
  slug: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const interval = setInterval(() => {
      start += 0.02;
      if (start >= 1) {
        start = 1;
        clearInterval(interval);
      }
      setProgress(start);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [inView]);

  const cx = 150;
  const cy = 150;
  const maxR = 110;
  const n = data.length;
  const hasData = data.some((d) => d.value > 0);

  // Generate hexagon points
  const getPoint = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const toPath = (points: { x: number; y: number }[]) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  // Grid rings
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Data polygon
  const dataPoints = data.map((d, i) =>
    getPoint(i, (d.value / 99) * maxR * progress)
  );

  return (
    <div className="flex flex-col items-center px-6 pb-6">
      <svg
        ref={ref}
        viewBox="0 0 300 300"
        className="w-full max-w-[320px]"
      >
        {/* Grid rings */}
        {rings.map((r) => (
          <polygon
            key={r}
            points={Array.from({ length: n }, (_, i) => {
              const p = getPoint(i, maxR * r);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {data.map((_, i) => {
          const p = getPoint(i, maxR);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="#1A1A1A"
              strokeWidth="1"
            />
          );
        })}

        {/* Data fill polygon */}
        {hasData && (
          <>
            <polygon
              points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="rgba(201, 169, 97, 0.15)"
              stroke="#C9A961"
              strokeWidth="2"
            />
            {/* Data points (dots) */}
            {dataPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#C9A961"
                stroke="#0A0A0A"
                strokeWidth="2"
              />
            ))}
          </>
        )}

        {/* Labels */}
        {data.map((d, i) => {
          const labelR = maxR + 24;
          const p = getPoint(i, labelR);
          const angle = (360 * i) / n - 90;
          let anchor: 'start' | 'middle' | 'end' = 'middle';
          if (angle > 30 && angle < 150) anchor = 'start';
          if (angle > 210 && angle < 330) anchor = 'end';

          return (
            <g key={d.label}>
              <text
                x={p.x}
                y={p.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                className="fill-gray-400 text-[10px] font-barlow uppercase"
                style={{ fontSize: '10px' }}
              >
                {d.label}
              </text>
              {hasData && (
                <text
                  x={p.x}
                  y={p.y + 14}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  className="fill-[#C9A961] text-[11px] font-barlow font-bold"
                  style={{ fontSize: '11px' }}
                >
                  {d.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Empty state overlay */}
      {!hasData && (
        <div className="-mt-[160px] relative z-10 text-center mb-4">
          <p className="text-sm text-gray-600 mb-3">No assessment data yet</p>
          <Link href={`/admin/players/${slug}#bb-metrics`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Crosshair className="w-3.5 h-3.5" />
              Add Assessment
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STATUS BADGE (with pulse for ACTIVE)
// ============================================================
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    'in-season': { bg: 'bg-[#C9A961]/20', text: 'text-[#C9A961]', label: 'ACTIVE' },
    'off-season': { bg: 'bg-gray-700/50', text: 'text-gray-400', label: 'OFF-SEASON' },
    playoffs: { bg: 'bg-[#C9A961]/30', text: 'text-[#E8D5A3]', label: 'PLAYOFFS' },
    'pre-season': { bg: 'bg-blue-900/40', text: 'text-blue-400', label: 'PRE-SEASON' },
  };
  const c = config[status] || config['off-season'];
  const isActive = status === 'in-season' || status === 'playoffs';

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest relative',
        c.bg,
        c.text,
        isActive && 'animate-pulse-glow'
      )}
    >
      {c.label}
      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 169, 97, 0.4); }
          50% { box-shadow: 0 0 12px 2px rgba(201, 169, 97, 0.2); }
        }
        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
      `}</style>
    </span>
  );
}

// ============================================================
// SKELETON LOADER
// ============================================================
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-barlow">
      <div className="sticky top-0 z-50 bg-gradient-to-b from-[#0D0D0D] to-transparent px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#1A1A1A] animate-pulse" />
          <div className="h-8 w-64 rounded bg-[#1A1A1A] animate-pulse" />
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/5 space-y-6">
            <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden">
              <div className="aspect-[3/4] bg-[#1A1A1A] animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-6 w-48 rounded bg-[#1A1A1A] animate-pulse" />
                <div className="h-4 w-32 rounded bg-[#1A1A1A] animate-pulse" />
              </div>
            </div>
          </div>
          <div className="lg:w-3/5 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-6">
                <div className="h-6 w-40 rounded bg-[#1A1A1A] animate-pulse mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-24 rounded-xl bg-[#0A0A0A] animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD PAGE
// ============================================================
export default function PlayerDashboardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<PlayerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/player-dashboard/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json: PlayerDashboardData = await res.json();
      setData(json);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`/api/admin/player-dashboard/${slug}/sync-stats`, { method: 'POST' });
      if (res.ok) {
        // Refetch to get updated data
        await fetchData();
      }
    } catch (err) {
      console.error('Sync error:', err);
    }
    setSyncing(false);
  };

  if (loading || !data) return <DashboardSkeleton />;

  const { player, seasonStats, recentGames, bbMetrics, rollingStats, upcomingSessions, highlights, clips, videoClips, autoHighlights } = data;
  const fullName = `${player.firstName} ${player.lastName}`;

  // Determine film clips to display
  const filmClips: Array<{ id: string; title: string; thumbnailUrl?: string; url: string; duration?: number; category?: string }> =
    clips.length > 0
      ? clips.map((c) => ({ id: c.id, title: c.title, thumbnailUrl: c.thumbnailUrl, url: c.url, duration: c.duration, category: c.category }))
      : videoClips.map((v) => ({ id: v.id, title: v.title, thumbnailUrl: v.thumbnailUrl, url: v.url, duration: v.duration, category: v.category }));

  // Generate 7-day calendar
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = new Date().toISOString().split('T')[0];

  // Merge manual highlights + auto highlights for timeline
  const allHighlights = [
    ...highlights.map((h) => ({
      id: h.id,
      title: h.title,
      date: h.highlightDate,
      statLine: h.statLine,
      opponent: h.opponent,
      category: h.category,
      isPinned: h.isPinned,
      type: 'manual' as const,
    })),
    ...(autoHighlights || []).map((a) => ({
      id: a.id,
      title: a.title,
      date: a.date,
      statLine: a.statLine,
      opponent: a.opponent,
      category: a.category,
      isPinned: false,
      type: 'auto' as const,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // BB Assessment radar data
  const radarData = [
    { label: 'Shooting', value: bbMetrics?.backRimRate ? Math.round((bbMetrics.backRimRate / 14) * 99) : 0 },
    { label: 'Movement', value: bbMetrics?.movementBandwidth ? Math.round(bbMetrics.movementBandwidth) : 0 },
    { label: 'Ball Manip', value: bbMetrics?.offDribbleCalibration ? Math.round(bbMetrics.offDribbleCalibration) : 0 },
    { label: 'Vision', value: bbMetrics?.strobeLevel ? Math.round(bbMetrics.strobeLevel) : 0 },
    { label: 'Constraint', value: bbMetrics?.catchShootSpeed ? Math.round(bbMetrics.catchShootSpeed) : 0 },
    { label: 'Live Transfer', value: bbMetrics?.energyTransferScore ? Math.round(bbMetrics.energyTransferScore) : 0 },
  ];

  // Compute overall BB rating
  const ratedValues = radarData.filter((d) => d.value > 0);
  const overallRating = ratedValues.length > 0
    ? Math.round(ratedValues.reduce((sum, d) => sum + d.value, 0) / ratedValues.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-barlow relative">
      {/* Noise/grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ============================================ */}
      {/* TOP BAR (STICKY)                            */}
      {/* ============================================ */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/95 to-transparent backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/players"
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center hover:border-[#C9A961]/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <h1 className="text-3xl font-barlow font-bold uppercase tracking-wider text-white">
                {fullName}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 tracking-wide">
                {player.position}
                {player.team && <span className="text-gray-600 mx-1">/</span>}
                {player.team}
              </span>
              <StatusBadge status={player.seasonStatus} />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 mr-2">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-colors',
                      level <= player.bbLevel
                        ? 'bg-[#C9A961] shadow-[0_0_6px_rgba(201,169,97,0.5)]'
                        : 'bg-[#2A2A2A]'
                    )}
                  />
                ))}
                <span className="text-[10px] text-gray-500 ml-1.5 uppercase tracking-wider">
                  BB{player.bbLevel}
                </span>
              </div>

              <Link href={`/admin/players/${slug}`}>
                <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:text-white">
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-[#C9A961]/30 text-[#C9A961] hover:bg-[#C9A961]/10 hover:text-[#E8D5A3]"
                onClick={handleSync}
                disabled={syncing}
              >
                <RefreshCw className={cn('w-3.5 h-3.5', syncing && 'animate-spin')} />
                {syncing ? 'Syncing...' : 'Sync Stats'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT                                 */}
      {/* ============================================ */}
      <div className="max-w-[1600px] mx-auto px-6 pb-20 pt-2 relative z-[2]">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ======================================== */}
          {/* LEFT COLUMN — Player Hero                */}
          {/* ======================================== */}
          <div className="lg:w-2/5 space-y-6">
            {/* PLAYER HERO CARD */}
            <FadeIn>
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden shadow-[0_0_60px_rgba(201,169,97,0.08)]">
                <div className="relative aspect-[3/4] bg-gradient-to-b from-[#0A0A0A] to-[#111] flex items-center justify-center overflow-hidden">
                  {player.headshotUrl ? (
                    <Image
                      src={player.headshotUrl}
                      alt={fullName}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0A0A0A] to-[#151515]">
                      <User className="w-32 h-32 text-[#1A1A1A]" />
                    </div>
                  )}
                  {/* Dark fade from bottom for name legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent" />
                  {/* Gold ring glow around edges */}
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(201,169,97,0.08)]" />
                </div>

                <div className="p-6 -mt-12 relative z-10">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                    {fullName}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {player.position} {player.team && `— ${player.team}`}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A961]/10 border border-[#C9A961]/20">
                    <div className="w-2 h-2 rounded-full bg-[#C9A961]" />
                    <span className="text-xs font-bold text-[#C9A961] uppercase tracking-widest">
                      BB Level {player.bbLevel}
                    </span>
                    {player.bbLevelName && (
                      <span className="text-[10px] text-[#C9A961]/60 ml-1">{player.bbLevelName}</span>
                    )}
                  </div>

                  <div className="mt-3">
                    <StatusBadge status={player.seasonStatus} />
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* QUICK STATS STRIP */}
            <FadeIn delay={0.1}>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#111] border border-[#1A1A1A] p-4 text-center">
                  <div className="text-2xl font-bold text-white font-barlow">
                    {seasonStats?.gamesPlayed ?? '--'}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">GP</div>
                </div>
                <div className="rounded-xl bg-[#111] border border-[#1A1A1A] p-4 text-center">
                  <div className="text-2xl font-bold text-white font-barlow">
                    {seasonStats?.mpg ? seasonStats.mpg.toFixed(1) : '--'}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">MIN</div>
                </div>
                <div className="rounded-xl bg-[#111] border border-[#1A1A1A] p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {rollingStats?.currentStreak === 'hot' && <Flame className="w-4 h-4 text-orange-500" />}
                    {rollingStats?.currentStreak === 'cold' && <Snowflake className="w-4 h-4 text-blue-400" />}
                    {(!rollingStats || rollingStats.currentStreak === 'neutral') && <Minus className="w-4 h-4 text-gray-500" />}
                    <span className={cn(
                      'text-2xl font-bold font-barlow',
                      rollingStats?.currentStreak === 'hot' ? 'text-orange-500' :
                      rollingStats?.currentStreak === 'cold' ? 'text-blue-400' : 'text-gray-500'
                    )}>
                      {rollingStats?.streakGames ?? 0}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">STREAK</div>
                </div>
              </div>
            </FadeIn>

            {/* QUICK LINKS */}
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Sessions', icon: Calendar, href: `/admin/players/${slug}/sessions` },
                  { label: 'Post-Game', icon: ClipboardList, href: `/admin/players/${slug}/postgame` },
                  { label: 'Film Library', icon: Film, href: `/admin/players/${slug}#video-library` },
                  { label: 'Coach Notes', icon: MessageSquare, href: `/admin/players/${slug}#coach-notes` },
                ].map(({ label, icon: Icon, href }) => (
                  <Link key={label} href={href}>
                    <div className="rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] p-4 flex items-center gap-3 hover:border-[#C9A961]/30 transition-colors cursor-pointer group">
                      <Icon className="w-4 h-4 text-gray-600 group-hover:text-[#C9A961] transition-colors" />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* ======================================== */}
          {/* RIGHT COLUMN                             */}
          {/* ======================================== */}
          <div className="lg:w-3/5 space-y-8">

            {/* ===== SECTION A: SEASON STATS — 2K CARD TREATMENT ===== */}
            <FadeIn delay={0.1}>
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] border-t-2 border-t-[#C9A961] overflow-hidden">
                <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    Season Stats
                  </h3>
                  <span className="text-xs text-gray-600">
                    {seasonStats?.season || '2025-26'}
                    {seasonStats?.source === 'balldontlie' && (
                      <span className="ml-2 text-[#C9A961]/50">NBA API</span>
                    )}
                  </span>
                </div>

                {seasonStats ? (
                  <div className="px-6 pb-6 pt-2">
                    {/* Primary Stats — BIG GOLD NUMBERS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      {[
                        { label: 'PPG', value: seasonStats.ppg, decimals: 1, hero: false },
                        { label: '3P%', value: seasonStats.threePtPct, decimals: 1, hero: true },
                        { label: 'FG%', value: seasonStats.fgPct, decimals: 1, hero: false },
                        { label: 'FT%', value: seasonStats.ftPct, decimals: 1, hero: false },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className={cn(
                            'rounded-xl p-5 text-center',
                            stat.hero
                              ? 'bg-gradient-to-b from-[#C9A961]/10 to-[#0A0A0A] border border-[#C9A961]/30'
                              : 'bg-[#0A0A0A] border border-[#1A1A1A]'
                          )}
                        >
                          <div
                            className={cn(
                              'text-4xl sm:text-5xl font-barlow font-bold',
                              stat.hero
                                ? 'text-[#C9A961] drop-shadow-[0_0_20px_rgba(201,169,97,0.3)]'
                                : 'text-white'
                            )}
                          >
                            <CountUp
                              target={stat.value}
                              decimals={stat.decimals}
                              suffix={stat.label.includes('%') ? '%' : ''}
                            />
                          </div>
                          <div
                            className={cn(
                              'text-[10px] uppercase tracking-[0.2em] mt-2',
                              stat.hero ? 'text-[#C9A961]/60' : 'text-gray-500'
                            )}
                          >
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Secondary Stats Row */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {[
                        { label: 'RPG', value: seasonStats.rpg },
                        { label: 'APG', value: seasonStats.apg },
                        { label: 'SPG', value: seasonStats.spg },
                        { label: 'BPG', value: seasonStats.bpg },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] p-3 text-center">
                          <div className="text-2xl font-barlow font-bold text-white">
                            <CountUp target={stat.value} decimals={1} />
                          </div>
                          <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Shooting Split Bars */}
                    <div className="space-y-3">
                      <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Shooting Splits</div>
                      <ShootingSplitBar label="3PT %" value={seasonStats.threePtPct} max={60} delay={0.1} />
                      {seasonStats.midRangePct != null && (
                        <ShootingSplitBar label="Mid-Range" value={seasonStats.midRangePct} max={65} delay={0.2} />
                      )}
                      <ShootingSplitBar label="FG %" value={seasonStats.fgPct} max={65} delay={0.3} />
                      <ShootingSplitBar label="FT %" value={seasonStats.ftPct} max={100} delay={0.4} />
                    </div>
                  </div>
                ) : (
                  <div className="px-6 pb-6 pt-4 text-center">
                    <p className="text-sm text-gray-600 mb-3">No season stats available.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-[#C9A961]/30 text-[#C9A961]"
                      onClick={handleSync}
                      disabled={syncing}
                    >
                      <RefreshCw className={cn('w-3.5 h-3.5', syncing && 'animate-spin')} />
                      {syncing ? 'Syncing...' : 'Pull NBA Stats'}
                    </Button>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* ===== SECTION B: LAST 10 GAMES — HORIZONTAL SCROLL ===== */}
            <FadeIn delay={0.2}>
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    Last 10 Games
                  </h3>
                </div>

                {recentGames.length > 0 ? (
                  <div className="px-6 pb-6">
                    <div className="overflow-x-auto flex gap-3 pb-2 scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#2A2A2A]">
                      {recentGames.map((game, i) => {
                        const threePct = game.threePointAttempts > 0
                          ? (game.threePointMakes / game.threePointAttempts) * 100
                          : 0;
                        const isHot3pt = threePct > 40 && game.threePointAttempts >= 3;
                        const big20 = (game.points ?? 0) >= 20;

                        return (
                          <motion.div
                            key={game.id}
                            className={cn(
                              'w-[160px] flex-shrink-0 rounded-xl p-4 transition-all border',
                              isHot3pt
                                ? 'bg-[#1F2937] border-[#C9A961]/40 shadow-[0_0_20px_rgba(201,169,97,0.12)]'
                                : 'bg-[#1F2937] border-[#2A3441] hover:border-[#C9A961]/30'
                            )}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                          >
                            {/* Date */}
                            <div className="text-[10px] text-gray-500 mb-1.5">
                              {new Date(game.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>

                            {/* Opponent + W/L */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-white truncate">
                                {game.isHome ? 'vs' : '@'} {game.opponent}
                              </span>
                            </div>

                            {/* Points — LARGE */}
                            <div className={cn(
                              'text-3xl font-bold font-barlow',
                              big20 ? 'text-[#C9A961]' : 'text-white'
                            )}>
                              {game.points ?? '--'}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">PTS</div>

                            {/* 3PT Line */}
                            <div className="mt-2 text-xs">
                              <span className="text-white font-medium">
                                {game.threePointMakes}/{game.threePointAttempts}
                              </span>
                              <span className="text-gray-500 ml-1">3PT</span>
                              {game.threePointAttempts > 0 && (
                                <span className={cn(
                                  'ml-1 font-medium',
                                  threePct >= 40 ? 'text-[#C9A961]' : 'text-gray-500'
                                )}>
                                  ({threePct.toFixed(0)}%)
                                </span>
                              )}
                            </div>

                            {/* Hot 3PT indicator */}
                            {isHot3pt && (
                              <div className="mt-2 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-[#C9A961]" />
                                <span className="text-[9px] text-[#C9A961] font-bold uppercase tracking-wider">Hot</span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="px-6 pb-6 text-center">
                    <p className="text-sm text-gray-600">No game data yet.</p>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* ===== SECTION C: BB ASSESSMENT — RADAR HEXAGON ===== */}
            <FadeIn delay={0.3}>
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden">
                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    BB Assessment
                  </h3>
                  <div className="flex items-center gap-3">
                    {overallRating > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-barlow font-bold text-[#C9A961]">{overallRating}</span>
                        <span className="text-[10px] text-gray-600 uppercase">OVR</span>
                      </div>
                    )}
                    {bbMetrics?.metricDate && (
                      <span className="text-[10px] text-gray-600">
                        {new Date(bbMetrics.metricDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                <RadarChart data={radarData} slug={slug} />
              </div>
            </FadeIn>

            {/* ===== SECTION D: CALENDAR + UPCOMING ===== */}
            <FadeIn delay={0.35}>
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    Upcoming Schedule
                  </h3>
                </div>

                <div className="px-6 pb-6">
                  {/* Calendar Strip */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-[#0A0A0A] scrollbar-thumb-[#2A2A2A]">
                    {calendarDays.map((day) => {
                      const dateStr = day.toISOString().split('T')[0];
                      const isToday = dateStr === todayStr;
                      const sessionsOnDay = upcomingSessions.filter(
                        (s) => s.date.split('T')[0] === dateStr
                      );
                      const hasSession = sessionsOnDay.length > 0;

                      return (
                        <div
                          key={dateStr}
                          className={cn(
                            'w-20 flex-shrink-0 rounded-xl p-3 text-center transition-colors',
                            isToday
                              ? 'border-2 border-[#C9A961] bg-[#111]'
                              : hasSession
                              ? 'bg-[#111] border border-[#2A2A2A]'
                              : 'bg-[#0A0A0A] border border-[#1A1A1A]'
                          )}
                        >
                          <div className="text-[10px] text-gray-500 uppercase">
                            {dayNames[day.getDay()]}
                          </div>
                          <div className={cn(
                            'text-lg font-bold mt-0.5',
                            isToday ? 'text-[#C9A961]' : 'text-white'
                          )}>
                            {day.getDate()}
                          </div>
                          {hasSession && (
                            <div className="flex justify-center gap-1 mt-1.5">
                              {sessionsOnDay.slice(0, 3).map((s) => (
                                <div
                                  key={s.id}
                                  className="w-1.5 h-1.5 rounded-full bg-[#C9A961]"
                                  title={s.title || s.sessionType}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Session details */}
                  {upcomingSessions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {upcomingSessions.slice(0, 4).map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-3 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] px-4 py-3"
                        >
                          <div className="w-1 h-8 rounded-full bg-[#C9A961]" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium truncate">
                              {s.title || s.sessionType}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1A] text-gray-500 uppercase tracking-wider">
                            {s.sessionType}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* ===== SECTION E: NOTABLE MOMENTS TIMELINE ===== */}
            <FadeIn delay={0.4}>
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden">
                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    Notable Moments
                  </h3>
                  {allHighlights.length > 0 && (
                    <span className="text-[10px] text-gray-600">
                      {allHighlights.length} entries
                    </span>
                  )}
                </div>

                <div className="px-6 pb-6">
                  {allHighlights.length > 0 ? (
                    <div className="relative pl-8">
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-[#C9A961]/40 via-[#C9A961]/20 to-transparent" />

                      {allHighlights.slice(0, 10).map((h, i) => (
                        <motion.div
                          key={h.id}
                          className="relative pb-6"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                        >
                          {/* Gold dot */}
                          <div className={cn(
                            'absolute left-[-21px] top-1 w-3 h-3 rounded-full border-2 border-[#111]',
                            h.type === 'auto' ? 'bg-[#C9A961]' : 'bg-[#E8D5A3] shadow-[0_0_8px_rgba(201,169,97,0.5)]'
                          )} />

                          <div className="text-[10px] text-gray-600 mb-1">
                            {new Date(h.date).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                            {h.opponent && <span className="text-gray-700 ml-2">vs {h.opponent}</span>}
                          </div>
                          <div className="text-sm text-white font-medium">{h.title}</div>
                          {h.statLine && (
                            <div className="text-xs text-[#C9A961] mt-0.5">{h.statLine}</div>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A961]/10 text-[#C9A961]">
                              {h.category}
                            </span>
                            {h.type === 'auto' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#1A1A1A] text-gray-600">
                                auto
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 text-center">No notable moments yet. Play some games or add milestones!</p>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* ===== SECTION F: FILM CLIPS ===== */}
            <FadeIn delay={0.45}>
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    Film Library
                  </h3>
                </div>

                <div className="px-6 pb-6">
                  {filmClips.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {filmClips.slice(0, 6).map((clip) => (
                        <motion.div
                          key={clip.id}
                          className="rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden aspect-video relative group cursor-pointer"
                          onClick={() => window.open(clip.url, '_blank')}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {clip.thumbnailUrl ? (
                            <Image src={clip.thumbnailUrl} alt={clip.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-[#151515]">
                              <Play className="w-8 h-8 text-[#2A2A2A]" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-center px-2">
                              <Play className="w-8 h-8 text-[#C9A961] mx-auto mb-1" />
                              <span className="text-xs text-white font-medium line-clamp-2">{clip.title}</span>
                            </div>
                          </div>
                          {clip.duration && (
                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-gray-300">
                              {Math.floor(clip.duration / 60)}:{String(clip.duration % 60).padStart(2, '0')}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 text-center">No film clips yet.</p>
                  )}
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </div>
    </div>
  );
}
