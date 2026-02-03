'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Target,
  Clock,
  Zap,
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface TrackingEntry {
  id: string;
  date: string;
  sessionType: 'game-day' | 'practice-day' | 'off-day';
  duration: number; // in seconds
  battleDistance?: string;
  backRimLadderTime?: number; // in seconds
  ballFlightControl?: 'needs-work' | 'inconsistent' | 'solid' | 'dialed';
  testOutScore?: { made: number; total: number };
  notes?: string;
}

const STORAGE_KEY = 'bb-tracking-entries';

const sessionLabels = {
  'game-day': { name: 'Game Day', color: 'gold' },
  'practice-day': { name: 'Practice Day', color: 'blue' },
  'off-day': { name: 'Off Day', color: 'green' },
};

const ballFlightLabels = {
  'needs-work': 'Needs Work',
  'inconsistent': 'Inconsistent',
  'solid': 'Solid',
  'dialed': 'Dialed In',
};

export default function TrackingPage() {
  const [entries, setEntries] = useState<TrackingEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  // Form state
  const [sessionType, setSessionType] = useState<'game-day' | 'practice-day' | 'off-day'>('game-day');
  const [duration, setDuration] = useState('');
  const [battleDistance, setBattleDistance] = useState('');
  const [ladderTime, setLadderTime] = useState('');
  const [ballFlight, setBallFlight] = useState<'needs-work' | 'inconsistent' | 'solid' | 'dialed' | ''>('');
  const [testOutMade, setTestOutMade] = useState('');
  const [testOutTotal, setTestOutTotal] = useState('7');
  const [notes, setNotes] = useState('');

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load tracking entries');
      }
    }
  }, []);

  // Save entries to localStorage
  const saveEntries = (newEntries: TrackingEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: TrackingEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sessionType,
      duration: parseInt(duration) * 60 || 0,
      battleDistance: battleDistance || undefined,
      backRimLadderTime: ladderTime ? parseInt(ladderTime) : undefined,
      ballFlightControl: ballFlight || undefined,
      testOutScore: testOutMade ? { made: parseInt(testOutMade), total: parseInt(testOutTotal) } : undefined,
      notes: notes || undefined,
    };

    saveEntries([newEntry, ...entries]);

    // Reset form
    setShowForm(false);
    setDuration('');
    setBattleDistance('');
    setLadderTime('');
    setBallFlight('');
    setTestOutMade('');
    setTestOutTotal('7');
    setNotes('');
  };

  const deleteEntry = (id: string) => {
    if (confirm('Delete this entry?')) {
      saveEntries(entries.filter((e) => e.id !== id));
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate stats
  const last7Days = entries.filter((e) => {
    const entryDate = new Date(e.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });

  const totalSessions = last7Days.length;
  const avgDuration = last7Days.length
    ? Math.round(last7Days.reduce((acc, e) => acc + e.duration, 0) / last7Days.length / 60)
    : 0;

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-bb-dark/95 backdrop-blur-lg border-b border-bb-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/players/bb-logo.png"
                  alt="BB"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </Link>
              <Link href="/protocols" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </div>
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Log Session
            </Button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-gold-500/10 to-bb-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-gold-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Progress Tracker</h1>
              <p className="text-gray-400">Track your calibration over time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-6 bg-bb-dark border-y border-bb-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{totalSessions}</p>
              <p className="text-xs text-gray-500">Sessions (7 days)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{avgDuration}</p>
              <p className="text-xs text-gray-500">Avg Duration (min)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{entries.length}</p>
              <p className="text-xs text-gray-500">Total Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-500">
                {entries.length > 0 && entries[0].testOutScore
                  ? `${entries[0].testOutScore.made}/${entries[0].testOutScore.total}`
                  : '-'}
              </p>
              <p className="text-xs text-gray-500">Last Test Out</p>
            </div>
          </div>
        </div>
      </section>

      {/* Log Form */}
      {showForm && (
        <section className="py-6 bg-bb-card border-b border-bb-border">
          <div className="max-w-4xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Session Type</label>
                <div className="flex gap-2">
                  {(['game-day', 'practice-day', 'off-day'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSessionType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sessionType === type
                          ? type === 'game-day'
                            ? 'bg-gold-500 text-bb-black'
                            : type === 'practice-day'
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                          : 'bg-bb-dark text-gray-400 hover:text-white'
                      }`}
                    >
                      {sessionLabels[type].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 20"
                    className="w-full px-4 py-2 bg-bb-dark border border-bb-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Battle Distance</label>
                  <input
                    type="text"
                    value={battleDistance}
                    onChange={(e) => setBattleDistance(e.target.value)}
                    placeholder="e.g., 2 steps behind line"
                    className="w-full px-4 py-2 bg-bb-dark border border-bb-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Back-Rim Ladder Time (seconds)</label>
                  <input
                    type="number"
                    value={ladderTime}
                    onChange={(e) => setLadderTime(e.target.value)}
                    placeholder="e.g., 180"
                    className="w-full px-4 py-2 bg-bb-dark border border-bb-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Ball Flight Control</label>
                  <select
                    value={ballFlight}
                    onChange={(e) => setBallFlight(e.target.value as any)}
                    className="w-full px-4 py-2 bg-bb-dark border border-bb-border rounded-lg text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="">Select...</option>
                    <option value="needs-work">Needs Work</option>
                    <option value="inconsistent">Inconsistent</option>
                    <option value="solid">Solid</option>
                    <option value="dialed">Dialed In</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Test Out Score</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={testOutMade}
                    onChange={(e) => setTestOutMade(e.target.value)}
                    placeholder="Made"
                    min="0"
                    className="w-20 px-4 py-2 bg-bb-dark border border-bb-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                  />
                  <span className="text-gray-500">/</span>
                  <select
                    value={testOutTotal}
                    onChange={(e) => setTestOutTotal(e.target.value)}
                    className="w-20 px-4 py-2 bg-bb-dark border border-bb-border rounded-lg text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="7">7</option>
                    <option value="14">14</option>
                  </select>
                  <span className="text-gray-400 text-sm ml-2">(back rim or make)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it feel? Any breakthroughs or issues?"
                  rows={3}
                  className="w-full px-4 py-2 bg-bb-dark border border-bb-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Save Entry
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Entries List */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-4">Session History</h2>

          {entries.length === 0 ? (
            <Card variant="glass" className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No sessions logged yet</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Session
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => {
                const isExpanded = expandedEntry === entry.id;
                const sessionInfo = sessionLabels[entry.sessionType];

                return (
                  <Card
                    key={entry.id}
                    variant="glass"
                    className="overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              sessionInfo.color === 'gold'
                                ? 'bg-gold-500'
                                : sessionInfo.color === 'blue'
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                            }`}
                          />
                          <div>
                            <p className="text-white font-medium">{sessionInfo.name}</p>
                            <p className="text-gray-500 text-sm">{formatDate(entry.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {entry.testOutScore && (
                            <div className="text-right">
                              <p className="text-gold-500 font-bold">
                                {entry.testOutScore.made}/{entry.testOutScore.total}
                              </p>
                              <p className="text-gray-500 text-xs">Test Out</p>
                            </div>
                          )}
                          <div className="text-right">
                            <p className="text-white">{formatDuration(entry.duration)}</p>
                            <p className="text-gray-500 text-xs">Duration</p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-bb-border">
                        <div className="pt-4 grid sm:grid-cols-2 gap-4">
                          {entry.battleDistance && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Battle Distance</p>
                              <p className="text-white">{entry.battleDistance}</p>
                            </div>
                          )}
                          {entry.backRimLadderTime && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Ladder Time</p>
                              <p className="text-white">{entry.backRimLadderTime}s</p>
                            </div>
                          )}
                          {entry.ballFlightControl && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Ball Flight</p>
                              <p className="text-white">{ballFlightLabels[entry.ballFlightControl]}</p>
                            </div>
                          )}
                          {entry.notes && (
                            <div className="sm:col-span-2">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Notes</p>
                              <p className="text-gray-300">{entry.notes}</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-bb-border">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEntry(entry.id);
                            }}
                            className="flex items-center text-red-400 hover:text-red-300 text-sm"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete Entry
                          </button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* What to Track Reminder */}
      <section className="py-12 bg-bb-dark">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-6">What to Track</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card variant="glass" className="p-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Battle Distance</p>
                  <p className="text-gray-400 text-sm">Where you start deep distance work</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Back-Rim Ladder Time</p>
                  <p className="text-gray-400 text-sm">How fast you complete the ladder</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Ball Flight Control</p>
                  <p className="text-gray-400 text-sm">Can you hit flat/normal/high on command?</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Mini Test Out Score</p>
                  <p className="text-gray-400 text-sm">7 or 14 spot test results</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-t from-gold-500/10 to-bb-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Train?</h2>
          <p className="text-gray-400 mb-6">Pick your session and get after it.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/protocols/game-day">
              <Button size="lg" className="w-full sm:w-auto">
                Game Day Protocol
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/protocols/practice-day">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Practice Day Protocol
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
