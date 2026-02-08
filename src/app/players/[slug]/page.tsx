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
  Clock,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
  Plus,
  Video,
  BarChart3,
  Brain,
  Crosshair,
  MapPin,
  User,
  Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type {
  ElitePlayerDashboard,
  LimitingFactor,
  GameScoutingReport,
  VideoClip,
  DailyCue,
} from '@/types/elite-player';

// BB Level badge component
function BBLevelBadge({ level }: { level: number }) {
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
      <span className="text-gold-500 font-medium">
        BB {level} · {levelNames[level]}
      </span>
    </div>
  );
}

// Streak indicator
function StreakIndicator({ streak, games }: { streak: string; games: number }) {
  if (streak === 'neutral') return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
        streak === 'hot' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
      )}
    >
      {streak === 'hot' ? <Flame className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
      {games} game {streak} streak
    </div>
  );
}

// Priority badge for limiting factors
function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <span className={cn('px-2 py-0.5 text-xs font-medium rounded border', colors[priority])}>
      {priority.toUpperCase()}
    </span>
  );
}

// Category icon for daily cues
function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, React.ReactNode> = {
    shooting: <Target className="w-4 h-4 text-gold-500" />,
    decision: <Brain className="w-4 h-4 text-purple-400" />,
    mindset: <Flame className="w-4 h-4 text-orange-400" />,
    movement: <MapPin className="w-4 h-4 text-blue-400" />,
  };

  return icons[category] || <Target className="w-4 h-4 text-gray-400" />;
}

// Video tag colors
function VideoTag({ tag }: { tag: string }) {
  const colors: Record<string, string> = {
    'off-dribble': 'bg-purple-500/20 text-purple-400',
    'catch-and-shoot': 'bg-blue-500/20 text-blue-400',
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
      {tag.replace('-', ' ')}
    </span>
  );
}

export default function ElitePlayerDashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const accessToken = searchParams.get('token');
  const isAdmin = searchParams.get('admin') === 'true';

  const [dashboard, setDashboard] = useState<ElitePlayerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    limitingFactors: true,
    games: true,
    stats: true,
    videos: false,
    cues: true,
  });

  // Admin editing states
  const [editingFocus, setEditingFocus] = useState(false);
  const [focusText, setFocusText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [slug, accessToken]);

  async function fetchDashboard() {
    try {
      setLoading(true);
      const tokenParam = accessToken ? `?token=${accessToken}` : '';
      const res = await fetch(`/api/elite-players/${slug}${tokenParam}`);

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

  function toggleSection(section: string) {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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

  const { player, todaysFocus, limitingFactors, recentGames, stats, videoLibrary, dailyCues } = dashboard;

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
            <BBLevelBadge level={player.bbLevel} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Today's Focus - Hero Section */}
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingFocus(false)}
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveFocus}
                        disabled={isSaving}
                        className="bg-gold-500 hover:bg-gold-600 text-black"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingFocus(true)}
                    >
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

        {/* Daily Cues - Quick Reference */}
        <Card>
          <CardHeader className="pb-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('cues')}
            >
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-gold-500" />
                Pre-Game Cues
              </CardTitle>
              {expandedSections.cues ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </CardHeader>
          {expandedSections.cues && (
            <CardContent>
              <div className="space-y-2">
                {dailyCues.filter(c => c.isActive).map((cue, i) => (
                  <div
                    key={cue.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-bb-dark/50 border border-bb-border"
                  >
                    <span className="text-gold-500 font-bold text-lg">{i + 1}</span>
                    <CategoryIcon category={cue.category} />
                    <span className="text-white flex-1">{cue.cueText}</span>
                  </div>
                ))}
                {dailyCues.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No cues set</p>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* BB Limiting Factors */}
        <Card>
          <CardHeader className="pb-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('limitingFactors')}
            >
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                BB Limiting Factors
              </CardTitle>
              {expandedSections.limitingFactors ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </CardHeader>
          {expandedSections.limitingFactors && (
            <CardContent>
              <div className="space-y-4">
                {limitingFactors.filter(f => f.isActive).map((factor) => (
                  <div
                    key={factor.id}
                    className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{factor.name}</h4>
                      <PriorityBadge priority={factor.priority} />
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{factor.shortDescription}</p>
                    <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20">
                      <p className="text-gold-400 text-sm">
                        <span className="font-medium">Awareness Cue:</span> {factor.awarenesssCue}
                      </p>
                    </div>
                  </div>
                ))}
                {limitingFactors.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No limiting factors identified</p>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Stats & Trends */}
        {stats && (
          <Card>
            <CardHeader className="pb-3">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('stats')}
              >
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Stats & Trends
                </CardTitle>
                {expandedSections.stats ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </CardHeader>
            {expandedSections.stats && (
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border text-center">
                    <p className="text-3xl font-bold text-white">{stats.rolling3Game3PT?.toFixed(1) || '-'}%</p>
                    <p className="text-sm text-gray-400">3-Game 3PT%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border text-center">
                    <p className="text-3xl font-bold text-white">{stats.rolling5Game3PT?.toFixed(1) || '-'}%</p>
                    <p className="text-sm text-gray-400">5-Game 3PT%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border text-center">
                    <p className="text-3xl font-bold text-white">{stats.avgShotVolume?.toFixed(1) || '-'}</p>
                    <p className="text-sm text-gray-400">Avg 3PA/Game</p>
                  </div>
                  <div className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border text-center">
                    <StreakIndicator streak={stats.currentStreak} games={stats.streakGames} />
                    {stats.currentStreak === 'neutral' && (
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <Minus className="w-4 h-4" />
                        <span>Neutral</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-400 mt-1">Current Streak</p>
                  </div>
                </div>

                {(stats.backRimPercentage || stats.directionalMissPercentage) && (
                  <div className="mt-4 p-4 rounded-lg bg-bb-dark/50 border border-bb-border">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Miss Profile Trends</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {stats.backRimPercentage && (
                        <div>
                          <p className="text-xl font-bold text-white">{stats.backRimPercentage}%</p>
                          <p className="text-sm text-gray-500">Back Rim Misses</p>
                        </div>
                      )}
                      {stats.directionalMissPercentage && (
                        <div>
                          <p className="text-xl font-bold text-white">{stats.directionalMissPercentage}%</p>
                          <p className="text-sm text-gray-500">Directional Misses</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )}

        {/* Recent Games */}
        <Card>
          <CardHeader className="pb-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('games')}
            >
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Recent Games
              </CardTitle>
              {expandedSections.games ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </CardHeader>
          {expandedSections.games && (
            <CardContent>
              <div className="space-y-4">
                {recentGames.map((game) => (
                  <div
                    key={game.id}
                    className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {game.opponentLogo ? (
                          <Image
                            src={game.opponentLogo}
                            alt={game.opponent}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-400">
                              {game.opponent.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white">
                            {game.isHome ? 'vs' : '@'} {game.opponent}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(game.gameDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {game.threePointMakes}/{game.threePointAttempts}
                        </p>
                        <p className="text-sm text-gray-500">
                          {game.threePointPercentage?.toFixed(0) || '-'}% 3PT
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
                ))}
                {recentGames.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No games tracked yet</p>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Video Library */}
        <Card>
          <CardHeader className="pb-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('videos')}
            >
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-400" />
                Video Library
                <span className="text-sm font-normal text-gray-500">({videoLibrary.length})</span>
              </CardTitle>
              {expandedSections.videos ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </CardHeader>
          {expandedSections.videos && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoLibrary.map((video) => (
                  <a
                    key={video.id}
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
                ))}
                {videoLibrary.length === 0 && (
                  <p className="text-gray-500 text-center py-4 col-span-2">No videos added yet</p>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Player Input Section */}
        <PlayerInputSection
          slug={slug}
          onSubmit={() => fetchDashboard()}
        />
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

// Player Input Section Component
function PlayerInputSection({
  slug,
  onSubmit,
}: {
  slug: string;
  onSubmit: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [shotFeeling, setShotFeeling] = useState('');
  const [confidence, setConfidence] = useState<number>(3);
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
          notes: notes || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      // Reset form
      setShotFeeling('');
      setConfidence(3);
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
    <Card>
      <CardHeader className="pb-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-400" />
            How Are You Feeling?
          </CardTitle>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
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

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confidence Level (1-5)
              </label>
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
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Additional Notes (Optional)
              </label>
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
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
