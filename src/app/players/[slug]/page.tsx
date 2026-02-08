'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Target,
  Flame,
  TrendingUp,
  TrendingDown,
  Play,
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
  Video,
  BarChart3,
  Brain,
  Crosshair,
  User,
  Minus,
  FileText,
  Mic,
  Shield,
  Zap,
  Move,
  Hand,
  CircleDot,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type {
  ElitePlayerDashboard,
  LimitingFactor,
  GameScoutingReport,
  VideoClip,
  PregameCue,
  GameDayProtocol,
  WeeklyReview,
  CoachNote,
  VoiceNote,
} from '@/types/elite-player';

// BB Level badge
function BBLevelBadge({ level, levelName }: { level: number; levelName?: string }) {
  const levelNames: Record<number, string> = {
    1: 'Foundation',
    2: 'Calibrated',
    3: 'Adaptive',
    4: 'Master',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((l) => (
          <div
            key={l}
            className={cn(
              'w-2 h-6 rounded-sm',
              l <= level ? 'bg-gold-500' : 'bg-gray-700'
            )}
          />
        ))}
      </div>
      <span className="text-gold-500 font-medium text-sm">
        {levelName || `BB ${level} · ${levelNames[level]}`}
      </span>
    </div>
  );
}

// Streak indicator
function StreakIndicator({ streak, games }: { streak: string; games: number }) {
  if (streak === 'neutral' || games === 0) {
    return (
      <div className="flex items-center gap-1 text-gray-400">
        <Minus className="w-4 h-4" />
        <span className="text-sm">Neutral</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
        streak === 'hot' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
      )}
    >
      {streak === 'hot' ? <Flame className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
      {games}G {streak}
    </div>
  );
}

// Severity/Priority badge
function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <span className={cn('px-2 py-0.5 text-xs font-medium rounded border uppercase', colors[severity] || colors.medium)}>
      {severity}
    </span>
  );
}

// Category icon
function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, React.ReactNode> = {
    shooting: <Target className="w-4 h-4 text-gold-500" />,
    decision: <Brain className="w-4 h-4 text-purple-400" />,
    mindset: <Flame className="w-4 h-4 text-orange-400" />,
    movement: <Move className="w-4 h-4 text-blue-400" />,
    defense: <Shield className="w-4 h-4 text-red-400" />,
    rebounding: <Zap className="w-4 h-4 text-green-400" />,
    handle: <Hand className="w-4 h-4 text-cyan-400" />,
    finishing: <CircleDot className="w-4 h-4 text-pink-400" />,
  };
  return icons[category] || <Target className="w-4 h-4 text-gray-400" />;
}

// Video tag
function VideoTag({ tag }: { tag: string }) {
  const colors: Record<string, string> = {
    'off-dribble': 'bg-purple-500/20 text-purple-400',
    'catch-and-shoot': 'bg-blue-500/20 text-blue-400',
    'catch-shoot': 'bg-blue-500/20 text-blue-400',
    fade: 'bg-green-500/20 text-green-400',
    drift: 'bg-cyan-500/20 text-cyan-400',
    'deep-distance': 'bg-orange-500/20 text-orange-400',
    constraint: 'bg-yellow-500/20 text-yellow-400',
    strobes: 'bg-pink-500/20 text-pink-400',
    'oversize-ball': 'bg-indigo-500/20 text-indigo-400',
    'game-clip': 'bg-red-500/20 text-red-400',
    training: 'bg-emerald-500/20 text-emerald-400',
    calibration: 'bg-gold-500/20 text-gold-400',
  };

  return (
    <span className={cn('px-2 py-0.5 text-xs rounded', colors[tag] || 'bg-gray-500/20 text-gray-400')}>
      {tag.replace(/-/g, ' ')}
    </span>
  );
}

// Collapsible Section
function Section({
  title,
  icon,
  children,
  defaultOpen = true,
  badge,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
            {badge}
          </CardTitle>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      {isOpen && <CardContent>{children}</CardContent>}
    </Card>
  );
}

export default function ElitePlayerDashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isAdmin = searchParams.get('admin') === 'true';

  const [dashboard, setDashboard] = useState<ElitePlayerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin editing states
  const [editingFocus, setEditingFocus] = useState(false);
  const [focusText, setFocusText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [slug]);

  async function fetchDashboard() {
    try {
      setLoading(true);
      const res = await fetch(`/api/elite-players/${slug}`);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load dashboard');
      }

      const data = await res.json();
      setDashboard(data);
      if (data.todaysFocus) {
        setFocusText(data.todaysFocus.focusCue);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveFocus() {
    if (!dashboard) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_focus',
          focusCue: focusText,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      await fetchDashboard();
      setEditingFocus(false);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-bb-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">{error || 'Dashboard not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    player,
    todaysFocus,
    pregameCues,
    limitingFactors,
    gameDayProtocol,
    weeklyReview,
    recentGames,
    stats,
    videoLibrary,
    coachNotes,
    voiceNotes,
  } = dashboard;

  return (
    <div className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bb-dark/95 backdrop-blur border-b border-bb-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {player.headshotUrl ? (
                <Image
                  src={player.headshotUrl}
                  alt={`${player.firstName} ${player.lastName}`}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/30"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/10 border-2 border-gold-500/30 flex items-center justify-center">
                  <User className="w-7 h-7 text-gold-500" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">
                  {player.firstName} {player.lastName}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{player.position}</span>
                  <span>·</span>
                  <span>{player.team}</span>
                </div>
              </div>
            </div>
            <BBLevelBadge level={player.bbLevel} levelName={player.bbLevelName} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* TODAY'S FOCUS - Hero */}
        <Card variant="gold" className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-gold-500" />
                <h2 className="text-lg font-semibold text-white">Today's Focus</h2>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  {editingFocus ? (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => setEditingFocus(false)} disabled={isSaving}>
                        <X className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={handleSaveFocus} disabled={isSaving} className="bg-gold-500 hover:bg-gold-600 text-black">
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => setEditingFocus(true)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            {editingFocus ? (
              <Textarea
                value={focusText}
                onChange={(e) => setFocusText(e.target.value)}
                className="text-lg bg-bb-dark/50 border-gold-500/30 focus:border-gold-500"
                rows={2}
              />
            ) : (
              <p className="text-xl text-white font-medium">
                {todaysFocus?.focusCue || 'No focus set for today'}
              </p>
            )}
            {todaysFocus?.createdBy && (
              <p className="mt-3 text-sm text-gray-500">
                Set by {todaysFocus.createdBy} · {new Date().toLocaleDateString()}
              </p>
            )}
          </div>
        </Card>

        {/* PRE-GAME CUES */}
        <Section title="Pre-Game Cues" icon={<Target className="w-5 h-5 text-gold-500" />}>
          <div className="space-y-2">
            {pregameCues.length > 0 ? (
              pregameCues.map((cue, i) => (
                <div
                  key={cue.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-bb-dark/50 border border-bb-border"
                >
                  <span className="text-gold-500 font-bold text-lg w-6">{i + 1}</span>
                  <CategoryIcon category={cue.category} />
                  <span className="text-white flex-1">{cue.cueText}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No cues set</p>
            )}
          </div>
        </Section>

        {/* GAME DAY PROTOCOL */}
        {gameDayProtocol && (
          <Section
            title="Game Day Protocol"
            icon={<CircleDot className="w-5 h-5 text-purple-400" />}
            badge={<span className="text-xs text-gray-500 ml-2">{gameDayProtocol.duration}</span>}
            defaultOpen={false}
          >
            <div className="space-y-6">
              {/* Scoring Legend */}
              <div className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Scoring: Plus {gameDayProtocol.scoringSettings.targetScore}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Make = +1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MinusCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Back Rim = 0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300">Front Rim = -1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300">L/R Miss = -1</span>
                  </div>
                </div>
              </div>

              {/* 5-Spot Structure */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">5-Spot Rotation</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {gameDayProtocol.spots.map((spot) => (
                    <div key={spot.id} className="p-3 rounded-lg bg-bb-dark/50 border border-bb-border text-center">
                      <p className="text-white font-medium text-sm">{spot.name}</p>
                      <p className="text-xs text-gray-500">{spot.reps} reps</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shot Type Variety */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Shot Type Variety</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {gameDayProtocol.shotTypeVariety.filter(s => s.isActive).map((shot) => (
                    <div key={shot.id} className="flex items-center gap-2 p-2 rounded bg-bb-dark/30">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        shot.category === 'catch-shoot' ? 'bg-blue-400' :
                        shot.category === 'off-dribble' ? 'bg-purple-400' :
                        shot.category === 'pull-up' ? 'bg-orange-400' : 'bg-gray-400'
                      )} />
                      <span className="text-sm text-gray-300">{shot.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post Section */}
              {gameDayProtocol.postSection.enabled && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Post Work</h4>
                  <div className="flex flex-wrap gap-2">
                    {gameDayProtocol.postSection.moves.map((move, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-bb-dark/50 border border-bb-border text-sm text-gray-300">
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Principles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PrinciplesBlock title="Off Ball" items={gameDayProtocol.offBallPrinciples} icon={<Move className="w-4 h-4" />} />
                <PrinciplesBlock title="Defense" items={gameDayProtocol.defensePrinciples} icon={<Shield className="w-4 h-4" />} />
                <PrinciplesBlock title="Rebounding" items={gameDayProtocol.reboundingPrinciples} icon={<Zap className="w-4 h-4" />} />
                <PrinciplesBlock title="Handle" items={gameDayProtocol.handlePrinciples} icon={<Hand className="w-4 h-4" />} />
                <PrinciplesBlock title="Finishing" items={gameDayProtocol.finishingPrinciples} icon={<CircleDot className="w-4 h-4" />} />
              </div>
            </div>
          </Section>
        )}

        {/* LIMITING FACTORS */}
        <Section title="BB Limiting Factors" icon={<AlertCircle className="w-5 h-5 text-orange-400" />}>
          <div className="space-y-4">
            {limitingFactors.length > 0 ? (
              limitingFactors.map((factor) => (
                <div key={factor.id} className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{factor.name}</h4>
                    <SeverityBadge severity={factor.severity || factor.priority} />
                  </div>
                  {factor.shortDescription && (
                    <p className="text-gray-400 text-sm mb-3">{factor.shortDescription}</p>
                  )}
                  {factor.awarenesssCue && (
                    <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20">
                      <p className="text-gold-400 text-sm">
                        <span className="font-medium">Awareness Cue:</span> {factor.awarenesssCue}
                      </p>
                    </div>
                  )}
                  {factor.notes && (
                    <p className="text-gray-500 text-xs mt-2 italic">{factor.notes}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No limiting factors identified</p>
            )}
          </div>
        </Section>

        {/* WEEKLY REVIEW */}
        {weeklyReview && (
          <Section title="Weekly Review" icon={<Calendar className="w-5 h-5 text-blue-400" />} defaultOpen={false}>
            <div className="space-y-4">
              {weeklyReview.shootingTrend && (
                <div className="flex items-center gap-2">
                  {weeklyReview.shootingTrend === 'improving' ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : weeklyReview.shootingTrend === 'declining' ? (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  ) : (
                    <Minus className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={cn(
                    'text-sm font-medium',
                    weeklyReview.shootingTrend === 'improving' ? 'text-green-400' :
                    weeklyReview.shootingTrend === 'declining' ? 'text-red-400' : 'text-gray-400'
                  )}>
                    Shooting {weeklyReview.shootingTrend}
                  </span>
                </div>
              )}

              {weeklyReview.summary && (
                <p className="text-gray-300">{weeklyReview.summary}</p>
              )}

              {weeklyReview.whatChanged && weeklyReview.whatChanged.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">What Changed</h4>
                  <ul className="space-y-1">
                    {weeklyReview.whatChanged.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-green-400 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {weeklyReview.priorities && weeklyReview.priorities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Priorities This Week</h4>
                  <ul className="space-y-1">
                    {weeklyReview.priorities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-gold-400 mt-1">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* STATS & TRENDS */}
        {stats && (
          <Section title="Stats & Trends" icon={<BarChart3 className="w-5 h-5 text-blue-400" />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="3-Game 3PT%" value={stats.rolling3Game3PT?.toFixed(1) || '-'} suffix="%" />
              <StatCard label="5-Game 3PT%" value={stats.rolling5Game3PT?.toFixed(1) || '-'} suffix="%" />
              <StatCard label="Avg 3PA/Game" value={stats.avgShotVolume?.toFixed(1) || '-'} />
              <div className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border text-center">
                <StreakIndicator streak={stats.currentStreak} games={stats.streakGames} />
                <p className="text-sm text-gray-400 mt-1">Current Streak</p>
              </div>
            </div>
          </Section>
        )}

        {/* RECENT GAMES */}
        <Section
          title="Recent Games"
          icon={<Calendar className="w-5 h-5 text-purple-400" />}
          badge={<span className="text-xs text-gray-500 ml-2">({recentGames.length})</span>}
        >
          {recentGames.length > 0 ? (
            <div className="space-y-4">
              {recentGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No games tracked yet</p>
          )}
        </Section>

        {/* VIDEO LIBRARY */}
        <Section
          title="Video Library"
          icon={<Video className="w-5 h-5 text-red-400" />}
          badge={<span className="text-xs text-gray-500 ml-2">({videoLibrary.length})</span>}
          defaultOpen={false}
        >
          {videoLibrary.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoLibrary.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No videos added yet</p>
          )}
        </Section>

        {/* COACH NOTES */}
        {coachNotes && coachNotes.length > 0 && (
          <Section
            title="Coach Notes"
            icon={<FileText className="w-5 h-5 text-emerald-400" />}
            defaultOpen={false}
          >
            <div className="space-y-3">
              {coachNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border">
                  <p className="text-gray-300 text-sm">{note.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {note.createdBy && `${note.createdBy} · `}
                    {new Date(note.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* VOICE NOTES */}
        {voiceNotes && voiceNotes.length > 0 && (
          <Section
            title="Voice Notes"
            icon={<Mic className="w-5 h-5 text-pink-400" />}
            defaultOpen={false}
          >
            <div className="space-y-3">
              {voiceNotes.map((note) => (
                <a
                  key={note.id}
                  href={note.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg bg-bb-dark/50 border border-bb-border hover:border-gold-500/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{note.title}</p>
                    {note.duration && (
                      <p className="text-xs text-gray-500">{Math.floor(note.duration / 60)}:{(note.duration % 60).toString().padStart(2, '0')}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* PLAYER CHECK-IN */}
        <PlayerCheckIn slug={slug} onSubmit={fetchDashboard} />
      </main>

      {/* Footer */}
      <footer className="border-t border-bb-border py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Basketball Blueprint · Elite Performance Consulting
          </p>
        </div>
      </footer>
    </div>
  );
}

// Sub-components
function PrinciplesBlock({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="p-3 rounded-lg bg-bb-dark/30 border border-bb-border">
      <div className="flex items-center gap-2 mb-2 text-gray-400">
        {icon}
        <span className="text-xs font-medium uppercase">{title}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-gray-300">• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function StatCard({ label, value, suffix = '' }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border text-center">
      <p className="text-3xl font-bold text-white">{value}{suffix}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

function GameCard({ game }: { game: GameScoutingReport }) {
  return (
    <div className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-400">{game.opponent.charAt(0)}</span>
          </div>
          <div>
            <p className="font-semibold text-white">
              {game.isHome ? 'vs' : '@'} {game.opponent}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(game.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {game.minutesPlayed && ` · ${game.minutesPlayed} min`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {game.threePointMakes}/{game.threePointAttempts}
          </p>
          <p className="text-sm text-gray-500">
            {game.threePointPercentage?.toFixed(0) || '-'}% 3PT
            {game.points && ` · ${game.points} pts`}
          </p>
        </div>
      </div>

      {game.bbNotes && (
        <div className="mb-3 p-3 rounded-lg bg-bb-black/50 border border-bb-border">
          <p className="text-sm text-gray-300">{game.bbNotes}</p>
        </div>
      )}

      {game.huntingNextGame && (
        <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20">
          <p className="text-sm text-gold-400">
            <span className="font-medium">Hunt Next Game:</span> {game.huntingNextGame}
          </p>
        </div>
      )}
    </div>
  );
}

function VideoCard({ video }: { video: VideoClip }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-lg bg-bb-dark/50 border border-bb-border hover:border-gold-500/50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
          <Play className="w-6 h-6 text-gray-400 group-hover:text-gold-500 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate group-hover:text-gold-500 transition-colors">
            {video.title}
          </h4>
          {video.bbCue && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{video.bbCue}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.map((tag) => (
              <VideoTag key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

function PlayerCheckIn({ slug, onSubmit }: { slug: string; onSubmit: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shotFeeling, setShotFeeling] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!shotFeeling.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shotFeeling,
          confidence,
          energyLevel,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setShotFeeling('');
      setConfidence(3);
      setEnergyLevel(3);
      setNotes('');
      setIsOpen(false);
      onSubmit();
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Section title="How Are You Feeling?" icon={<User className="w-5 h-5 text-green-400" />} defaultOpen={false}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            How does your shot feel today?
          </label>
          <Textarea
            value={shotFeeling}
            onChange={(e) => setShotFeeling(e.target.value)}
            placeholder="Describe how your shot feels..."
            className="bg-bb-dark/50"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Confidence (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setConfidence(level)}
                  className={cn(
                    'w-10 h-10 rounded-lg border transition-colors font-medium',
                    confidence === level
                      ? 'bg-gold-500 border-gold-500 text-black'
                      : 'bg-bb-dark/50 border-bb-border text-gray-400 hover:border-gold-500/50'
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Energy (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEnergyLevel(level)}
                  className={cn(
                    'w-10 h-10 rounded-lg border transition-colors font-medium',
                    energyLevel === level
                      ? 'bg-green-500 border-green-500 text-black'
                      : 'bg-bb-dark/50 border-bb-border text-gray-400 hover:border-green-500/50'
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Notes (Optional)</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other thoughts..."
            className="bg-bb-dark/50"
            rows={2}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !shotFeeling.trim()}
          className="w-full bg-gold-500 hover:bg-gold-600 text-black font-medium"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Check-In'}
        </Button>
      </form>
    </Section>
  );
}
