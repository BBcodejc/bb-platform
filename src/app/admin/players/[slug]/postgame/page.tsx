'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  ExternalLink,
  ClipboardList,
  Check,
  X,
  Target,
  TrendingUp,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Drop-down option definitions
const SHOT_TYPES = [
  { value: 'catch-and-shoot', label: 'Catch & Shoot' },
  { value: 'pull-up', label: 'Pull-Up' },
  { value: 'off-screen', label: 'Off Screen' },
  { value: 'post-fade', label: 'Post Fade' },
  { value: 'step-back', label: 'Step Back' },
  { value: 'floater', label: 'Floater' },
  { value: 'other', label: 'Other' },
];

const MISS_TYPES = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'short', label: 'Short' },
  { value: 'long', label: 'Long' },
  { value: 'back-rim', label: 'Back Rim' },
  { value: 'front-rim', label: 'Front Rim' },
  { value: 'air-ball', label: 'Air Ball' },
  { value: 'blocked', label: 'Blocked' },
];

const TIME_TO_SHOT = [
  { value: '0.5_or_less', label: '0.5s or less' },
  { value: '0.5_to_0.8', label: '0.5 – 0.8s' },
  { value: '0.8_plus', label: '0.8s+' },
];

const ENERGY_PATTERNS = [
  { value: 'subtle_drift', label: 'Subtle Drift' },
  { value: 'very_little_drift', label: 'Very Little Drift' },
  { value: 'fade', label: 'Fade' },
];

const BALL_PATTERNS = [
  { value: 'dip', label: 'Dip' },
  { value: 'no_dip', label: 'No Dip' },
  { value: 'large_dip', label: 'Large Dip' },
  { value: 'compact_dip', label: 'Compact Dip' },
];

const FOLLOW_THROUGH = [
  { value: 'no_hold', label: 'No Hold' },
  { value: 'hold', label: 'Hold' },
];

const ALIGNMENT = [
  { value: 'square_to_rim', label: 'Square to Rim' },
  { value: 'bias_angled_left', label: 'Bias Angled Left' },
];

interface Shot {
  id?: string;
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

interface PlayerInfo {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
}

export default function PostGameEntryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Session form
  const [gameDate, setGameDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [opponent, setOpponent] = useState(searchParams.get('opponent') || '');

  // Current shot being entered
  const [currentShot, setCurrentShot] = useState<Omit<Shot, 'shotNumber'>>({
    result: 'make',
    shotType: '',
    missType: '',
    timeToShot: '',
    energyPattern: '',
    ballPattern: '',
    followThrough: '',
    alignment: '',
    notes: '',
  });

  // All shots logged
  const [shots, setShots] = useState<Shot[]>([]);

  // Existing postgame sessions
  const [existingSessions, setExistingSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchPlayerAndSessions();
  }, [slug]);

  async function fetchPlayerAndSessions() {
    try {
      setLoading(true);
      // Fetch player info via sessions API (reuse existing)
      const res = await fetch(`/api/elite-players/${slug}/sessions?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`);
      if (res.ok) {
        const data = await res.json();
        setPlayer(data.player);
      }

      // Fetch existing postgame sessions
      const pgRes = await fetch(`/api/elite-players/${slug}/postgame`);
      if (pgRes.ok) {
        const pgData = await pgRes.json();
        setExistingSessions(pgData.sessions || []);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSession() {
    if (!gameDate || !opponent.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/postgame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: gameDate,
          opponent: opponent.trim(),
          createdBy: 'Coach Jake',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSessionId(data.session.id);
        setSessionCreated(true);
        setReportUrl(`${window.location.origin}/elite/${slug}/postgame/${data.session.id}`);
      }
    } catch (err) {
      console.error('Failed to create session:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddShot() {
    if (!sessionId) return;

    const shotNumber = shots.length + 1;
    const newShot: Shot = {
      shotNumber,
      result: currentShot.result,
      shotType: currentShot.shotType,
      missType: currentShot.result === 'miss' ? currentShot.missType : '',
      timeToShot: currentShot.timeToShot,
      energyPattern: currentShot.energyPattern,
      ballPattern: currentShot.ballPattern,
      followThrough: currentShot.followThrough,
      alignment: currentShot.alignment,
      notes: currentShot.notes,
    };

    setSaving(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/postgame/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShot),
      });
      if (res.ok) {
        const data = await res.json();
        setShots([...shots, { ...newShot, id: data.shot.id }]);
        // Reset form but keep some defaults
        setCurrentShot({
          result: 'make',
          shotType: '',
          missType: '',
          timeToShot: '',
          energyPattern: '',
          ballPattern: '',
          followThrough: '',
          alignment: '',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Failed to add shot:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteShot(shotId: string, index: number) {
    if (!sessionId || !shotId) return;
    try {
      const res = await fetch(`/api/elite-players/${slug}/postgame/${sessionId}?shotId=${shotId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const newShots = shots.filter((_, i) => i !== index).map((s, i) => ({ ...s, shotNumber: i + 1 }));
        setShots(newShots);
      }
    } catch (err) {
      console.error('Failed to delete shot:', err);
    }
  }

  function handleCopyLink() {
    if (reportUrl) {
      navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Stats
  const totalShots = shots.length;
  const makes = shots.filter(s => s.result === 'make').length;
  const misses = totalShots - makes;
  const makePct = totalShots > 0 ? ((makes / totalShots) * 100).toFixed(1) : '0.0';

  if (loading) {
    return (
      <div className="min-h-screen bg-bb-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/admin/players/${slug}/sessions`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-amber-400" />
                  Post-Game Analysis
                </h1>
                <p className="text-sm text-gray-400">
                  {player ? `${player.firstName} ${player.lastName}` : 'Loading...'}
                  {sessionCreated && opponent && ` — vs ${opponent}`}
                </p>
              </div>
            </div>
            {reportUrl && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyLink}
                  variant="ghost"
                  size="sm"
                  className="text-amber-400 hover:text-amber-300"
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                <Link href={reportUrl} target="_blank">
                  <Button variant="ghost" size="sm" className="text-gold-500">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Report
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {!sessionCreated ? (
          <div className="space-y-6">
            {/* Create Session Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-amber-400" />
                  Start Post-Game Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Game Date</label>
                    <Input
                      type="date"
                      value={gameDate}
                      onChange={(e) => setGameDate(e.target.value)}
                      className="bg-bb-dark/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Opponent</label>
                    <Input
                      value={opponent}
                      onChange={(e) => setOpponent(e.target.value)}
                      placeholder="e.g., Knicks"
                      className="bg-bb-dark/50"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateSession}
                  disabled={saving || !gameDate || !opponent.trim()}
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" />Start Analysis</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Existing Sessions */}
            {existingSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Previous Post-Game Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {existingSessions.map(session => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-bb-dark/50 border border-bb-border"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{session.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(session.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {' · '}{session.totalShots} shots · {session.makes}/{session.totalShots} ({session.totalShots > 0 ? ((session.makes / session.totalShots) * 100).toFixed(1) : '0'}%)
                          </p>
                        </div>
                        <Link href={session.link || `/elite/${slug}/postgame/${session.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="text-amber-400">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shot Entry Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Add Shot #{shots.length + 1}</span>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      currentShot.result === 'make'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    )}>
                      {currentShot.result === 'make' ? 'MAKE' : 'MISS'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Result Toggle */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Result</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentShot({ ...currentShot, result: 'make', missType: '' })}
                        className={cn(
                          'flex-1 py-3 rounded-xl font-bold text-sm transition-all border',
                          currentShot.result === 'make'
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : 'bg-bb-dark/50 text-gray-500 border-bb-border hover:border-green-500/30'
                        )}
                      >
                        <Check className="w-4 h-4 inline mr-1" />
                        MAKE
                      </button>
                      <button
                        onClick={() => setCurrentShot({ ...currentShot, result: 'miss' })}
                        className={cn(
                          'flex-1 py-3 rounded-xl font-bold text-sm transition-all border',
                          currentShot.result === 'miss'
                            ? 'bg-red-500/20 text-red-400 border-red-500/50'
                            : 'bg-bb-dark/50 text-gray-500 border-bb-border hover:border-red-500/30'
                        )}
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        MISS
                      </button>
                    </div>
                  </div>

                  {/* Shot Type (for makes) / Miss Type (for misses) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Shot Type</label>
                      <select
                        value={currentShot.shotType}
                        onChange={(e) => setCurrentShot({ ...currentShot, shotType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-bb-dark/50 border border-bb-border text-white text-sm"
                      >
                        <option value="">Select...</option>
                        {SHOT_TYPES.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    {currentShot.result === 'miss' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Miss Type</label>
                        <select
                          value={currentShot.missType}
                          onChange={(e) => setCurrentShot({ ...currentShot, missType: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-bb-dark/50 border border-bb-border text-white text-sm"
                        >
                          <option value="">Select...</option>
                          {MISS_TYPES.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Time from Catch/Collection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Time from Catch/Collection to Shot</label>
                    <div className="flex gap-2">
                      {TIME_TO_SHOT.map(o => (
                        <button
                          key={o.value}
                          onClick={() => setCurrentShot({ ...currentShot, timeToShot: currentShot.timeToShot === o.value ? '' : o.value })}
                          className={cn(
                            'flex-1 py-2 rounded-lg text-xs font-medium transition-all border',
                            currentShot.timeToShot === o.value
                              ? 'bg-gold-500/20 text-gold-400 border-gold-500/50'
                              : 'bg-bb-dark/50 text-gray-400 border-bb-border hover:border-gold-500/30'
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Energy Pattern */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Energy Pattern</label>
                    <div className="flex gap-2">
                      {ENERGY_PATTERNS.map(o => (
                        <button
                          key={o.value}
                          onClick={() => setCurrentShot({ ...currentShot, energyPattern: currentShot.energyPattern === o.value ? '' : o.value })}
                          className={cn(
                            'flex-1 py-2 rounded-lg text-xs font-medium transition-all border',
                            currentShot.energyPattern === o.value
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                              : 'bg-bb-dark/50 text-gray-400 border-bb-border hover:border-blue-500/30'
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ball Pattern */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ball Pattern</label>
                    <div className="flex gap-2">
                      {BALL_PATTERNS.map(o => (
                        <button
                          key={o.value}
                          onClick={() => setCurrentShot({ ...currentShot, ballPattern: currentShot.ballPattern === o.value ? '' : o.value })}
                          className={cn(
                            'flex-1 py-2 rounded-lg text-xs font-medium transition-all border',
                            currentShot.ballPattern === o.value
                              ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                              : 'bg-bb-dark/50 text-gray-400 border-bb-border hover:border-purple-500/30'
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Follow Through */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Follow Through</label>
                    <div className="flex gap-2">
                      {FOLLOW_THROUGH.map(o => (
                        <button
                          key={o.value}
                          onClick={() => setCurrentShot({ ...currentShot, followThrough: currentShot.followThrough === o.value ? '' : o.value })}
                          className={cn(
                            'flex-1 py-2 rounded-lg text-xs font-medium transition-all border',
                            currentShot.followThrough === o.value
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                              : 'bg-bb-dark/50 text-gray-400 border-bb-border hover:border-emerald-500/30'
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Alignment</label>
                    <div className="flex gap-2">
                      {ALIGNMENT.map(o => (
                        <button
                          key={o.value}
                          onClick={() => setCurrentShot({ ...currentShot, alignment: currentShot.alignment === o.value ? '' : o.value })}
                          className={cn(
                            'flex-1 py-2 rounded-lg text-xs font-medium transition-all border',
                            currentShot.alignment === o.value
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                              : 'bg-bb-dark/50 text-gray-400 border-bb-border hover:border-orange-500/30'
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Notes (optional)</label>
                    <Input
                      value={currentShot.notes}
                      onChange={(e) => setCurrentShot({ ...currentShot, notes: e.target.value })}
                      placeholder="Quick note about this shot..."
                      className="bg-bb-dark/50"
                    />
                  </div>

                  {/* Add Button */}
                  <Button
                    onClick={handleAddShot}
                    disabled={saving}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      <><Plus className="w-4 h-4 mr-2" />Add Shot #{shots.length + 1}</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Shot Log */}
              {shots.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Shot Log ({shots.length} shots)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {shots.map((shot, i) => (
                        <div
                          key={shot.id || i}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border',
                            shot.result === 'make'
                              ? 'bg-green-500/5 border-green-500/20'
                              : 'bg-red-500/5 border-red-500/20'
                          )}
                        >
                          <span className="text-xs font-bold text-gray-500 w-6">#{shot.shotNumber}</span>
                          <span className={cn(
                            'text-xs font-bold px-2 py-0.5 rounded',
                            shot.result === 'make' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          )}>
                            {shot.result.toUpperCase()}
                          </span>
                          <div className="flex-1 flex flex-wrap gap-1">
                            {shot.shotType && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-gold-500/10 text-gold-400 rounded">
                                {SHOT_TYPES.find(t => t.value === shot.shotType)?.label || shot.shotType}
                              </span>
                            )}
                            {shot.result === 'miss' && shot.missType && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded">
                                {MISS_TYPES.find(t => t.value === shot.missType)?.label || shot.missType}
                              </span>
                            )}
                            {shot.timeToShot && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-500/10 text-gray-400 rounded">
                                {TIME_TO_SHOT.find(t => t.value === shot.timeToShot)?.label}
                              </span>
                            )}
                            {shot.energyPattern && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded">
                                {ENERGY_PATTERNS.find(t => t.value === shot.energyPattern)?.label}
                              </span>
                            )}
                            {shot.ballPattern && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded">
                                {BALL_PATTERNS.find(t => t.value === shot.ballPattern)?.label}
                              </span>
                            )}
                            {shot.followThrough && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
                                {FOLLOW_THROUGH.find(t => t.value === shot.followThrough)?.label}
                              </span>
                            )}
                            {shot.alignment && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/10 text-orange-400 rounded">
                                {ALIGNMENT.find(t => t.value === shot.alignment)?.label}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => shot.id && handleDeleteShot(shot.id, i)}
                            className="p-1 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar - Live Stats */}
            <div className="space-y-4">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gold-500" />
                    Live Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 rounded-lg bg-bb-dark/50">
                      <p className="text-2xl font-bold text-white">{totalShots}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Total</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-green-500/10">
                      <p className="text-2xl font-bold text-green-400">{makes}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Makes</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-500/10">
                      <p className="text-2xl font-bold text-red-400">{misses}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Misses</p>
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gold-500/10 border border-gold-500/20">
                    <p className="text-3xl font-bold text-gold-500">{makePct}%</p>
                    <p className="text-xs text-gray-400">Make Rate</p>
                  </div>
                </CardContent>
              </Card>

              {/* Pattern Breakdowns */}
              {totalShots > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pattern Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Energy Pattern breakdown */}
                    {shots.some(s => s.energyPattern) && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Energy Pattern</p>
                        <div className="space-y-1">
                          {ENERGY_PATTERNS.map(ep => {
                            const count = shots.filter(s => s.energyPattern === ep.value).length;
                            if (count === 0) return null;
                            return (
                              <div key={ep.value} className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">{ep.label}</span>
                                <span className="text-white font-medium">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Ball Pattern breakdown */}
                    {shots.some(s => s.ballPattern) && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Ball Pattern</p>
                        <div className="space-y-1">
                          {BALL_PATTERNS.map(bp => {
                            const count = shots.filter(s => s.ballPattern === bp.value).length;
                            if (count === 0) return null;
                            return (
                              <div key={bp.value} className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">{bp.label}</span>
                                <span className="text-white font-medium">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Miss Type breakdown (if any misses) */}
                    {misses > 0 && shots.some(s => s.missType) && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Miss Types</p>
                        <div className="space-y-1">
                          {MISS_TYPES.map(mt => {
                            const count = shots.filter(s => s.missType === mt.value).length;
                            if (count === 0) return null;
                            return (
                              <div key={mt.value} className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">{mt.label}</span>
                                <span className="text-red-400 font-medium">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Report Link */}
              {reportUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Share Report</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-bb-dark/50 border border-bb-border">
                      <p className="text-xs text-gray-400 break-all">{reportUrl}</p>
                    </div>
                    <Button
                      onClick={handleCopyLink}
                      variant="ghost"
                      className="w-full text-amber-400 border border-amber-500/30"
                    >
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied!' : 'Copy Report URL'}
                    </Button>
                    <Link href={reportUrl} target="_blank" className="block">
                      <Button variant="ghost" className="w-full text-gold-500">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Report
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
