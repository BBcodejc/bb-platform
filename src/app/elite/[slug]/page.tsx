'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Target,
  Play,
  Mic,
  FileText,
  Calendar,
  Edit3,
  Save,
  X,
  Plus,
  Loader2,
  Shield,
  Lock,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Film,
  Heart,
  ClipboardCheck,
  Trophy,
  ClipboardList,
  TrendingUp,
  ExternalLink,
  Pause,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EliteLayout } from '@/components/elite/EliteLayout';
import { getCurrentUser, canEditElite, type AuthUser } from '@/lib/middleware/auth';
import type {
  EliteDashboard,
  ElitePregameCue,
  EliteCoachNote,
} from '@/types/elite-profile';

// ============================================
// ELITE PERFORMANCE DASHBOARD
// Premium athlete command center
// ============================================

const COACHES = ['Coach Jake', 'Coach Tommy'];

interface Session {
  id: string;
  playerId: string;
  date: string;
  sessionType: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  location?: string;
  opponent?: string;
  focusAreas: string[];
  notes?: string;
  coachingNotes?: string;
  coachingNotesVisible?: boolean;
  link?: string;
  videoUrl?: string;
  videoUrlClient?: string;
  bestTestOfDay?: string;
  createdBy?: string;
  createdAt: string;
}

const SESSION_TYPES = [
  { value: 'pre-game', label: 'Pre-Game', icon: Target, color: 'bg-gold-500/20 text-gold-400 border-gold-500/30' },
  { value: 'training', label: 'Training', icon: Dumbbell, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'film', label: 'Film', icon: Film, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'recovery', label: 'Recovery', icon: Heart, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'evaluation', label: 'Evaluation', icon: ClipboardCheck, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { value: 'game', label: 'Game', icon: Trophy, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'postgame', label: 'Post-Game', icon: ClipboardList, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getSessionTypeInfo(type: string) {
  return SESSION_TYPES.find(t => t.value === type) || SESSION_TYPES[1];
}

function getSessionDotColor(sessionType: string): string {
  const map: Record<string, string> = {
    'pre-game': 'bg-gold-500',
    'training': 'bg-blue-500',
    'film': 'bg-purple-500',
    'recovery': 'bg-green-500',
    'evaluation': 'bg-orange-500',
    'game': 'bg-red-500',
    'postgame': 'bg-amber-500',
  };
  return map[sessionType] || 'bg-gray-500';
}

function getAgendaLabel(sessionType: string): string {
  const map: Record<string, string> = {
    'pre-game': 'Calibration Session',
    'training': 'Training Session',
    'film': 'Visual Training',
    'recovery': 'Recovery Protocol',
    'evaluation': 'Evaluation',
    'game': 'Game Day',
    'postgame': 'Post-Game Review',
  };
  return map[sessionType] || 'Session';
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

// ============================================
// MAIN COMPONENT
// ============================================

function EliteProfileContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  // Data state
  const [dashboard, setDashboard] = useState<EliteDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState('Coach Jake');
  const [saving, setSaving] = useState(false);

  // Editing states
  const [editingCues, setEditingCues] = useState<ElitePregameCue[]>([]);
  const [newNote, setNewNote] = useState('');

  // Calendar state
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [todaysSessions, setTodaysSessions] = useState<Session[]>([]);
  const [dailyNotes, setDailyNotes] = useState<{ id: string; date: string; note: string; visibleToPlayer: boolean }[]>([]);

  // Audio playback
  const [playingNoteId, setPlayingNoteId] = useState<string | null>(null);
  const [noteProgress, setNoteProgress] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // ---- AUTH EFFECTS (unchanged) ----

  // Handle ?token=xxx URL parameter - auto-authenticate
  useEffect(() => {
    async function handleTokenParam() {
      const tokenParam = searchParams.get('token');
      if (!tokenParam) return;
      try {
        const res = await fetch('/api/elite/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenParam }),
        });
        if (res.ok) {
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          window.history.replaceState({}, '', url.toString());
        }
      } catch (e) {
        console.error('Auto-login failed:', e);
      }
    }
    handleTokenParam();
  }, [searchParams]);

  // Check authentication - dual auth
  useEffect(() => {
    async function checkAuth() {
      const result = await getCurrentUser();
      if (result.isAuthenticated && result.user) {
        setUser(result.user);
        setCanEdit(canEditElite(result.user.role));
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/elite/auth/verify?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.valid) {
            setUser({
              id: data.playerId,
              email: '',
              role: 'player' as AuthUser['role'],
              name: data.playerName,
              playerSlug: slug,
              playerId: data.playerId,
            });
            setCanEdit(false);
            setAuthLoading(false);
            return;
          }
        }
      } catch {}
      setAuthLoading(false);
      router.push(`/elite/login?redirect=/elite/${slug}`);
    }
    checkAuth();
  }, [slug, router]);

  // ---- DATA EFFECTS ----

  // Fetch elite profile data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/elite/${slug}`);
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setDashboard(data);
        setEditingCues(data.pregameCues || []);
      } catch (err) {
        setError('Unable to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  // Fetch today's sessions (one-time)
  useEffect(() => {
    async function fetchTodaySessions() {
      try {
        const today = new Date();
        const res = await fetch(
          `/api/elite/${slug}/sessions?month=${today.getMonth() + 1}&year=${today.getFullYear()}`
        );
        if (res.ok) {
          const data = await res.json();
          const todayStr = today.toISOString().split('T')[0];
          setTodaysSessions((data.sessions || []).filter((s: Session) => s.date === todayStr));
        }
      } catch {}
    }
    fetchTodaySessions();
  }, [slug]);

  // Fetch calendar month sessions
  useEffect(() => {
    async function fetchSessions() {
      setSessionsLoading(true);
      try {
        const res = await fetch(
          `/api/elite/${slug}/sessions?month=${currentMonth + 1}&year=${currentYear}`
        );
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
          setDailyNotes(data.dailyNotes || []);
        }
      } catch {
        console.error('Failed to fetch sessions');
      } finally {
        setSessionsLoading(false);
      }
    }
    fetchSessions();
  }, [slug, currentMonth, currentYear]);

  // ---- HANDLERS ----

  const handleLogout = async () => {
    await fetch('/api/elite/auth', { method: 'DELETE' });
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push('/elite/login');
  };

  const handleSave = async (section: string, data: any) => {
    if (!canEdit) return;
    setSaving(true);
    try {
      await fetch(`/api/elite/${slug}/admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: section, data, coach: selectedCoach }),
      });
      const res = await fetch(`/api/elite/${slug}`);
      const updated = await res.json();
      setDashboard(updated);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const addCoachNote = async () => {
    if (!newNote.trim() || !canEdit) return;
    await handleSave('add_note', { text: newNote });
    setNewNote('');
  };

  // Calendar helpers
  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function getSessionsForDate(date: string) {
    return sessions.filter(s => s.date === date);
  }

  // Build calendar grid
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const today = new Date().toISOString().split('T')[0];

  // Audio playback handler
  function togglePlayVoiceNote(noteId: string, url: string) {
    if (playingNoteId === noteId) {
      audioRefs.current[noteId]?.pause();
      setPlayingNoteId(null);
    } else {
      // Pause any currently playing
      if (playingNoteId && audioRefs.current[playingNoteId]) {
        audioRefs.current[playingNoteId].pause();
      }
      if (!audioRefs.current[noteId]) {
        const audio = new Audio(url);
        audio.onended = () => {
          setPlayingNoteId(null);
          setNoteProgress(prev => ({ ...prev, [noteId]: 0 }));
        };
        audio.ontimeupdate = () => {
          if (audio.duration) {
            setNoteProgress(prev => ({ ...prev, [noteId]: (audio.currentTime / audio.duration) * 100 }));
          }
        };
        audioRefs.current[noteId] = audio;
      }
      audioRefs.current[noteId].play();
      setPlayingNoteId(noteId);
    }
  }

  // ---- LOADING / ERROR STATES ----

  if (authLoading || loading) {
    return (
      <EliteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-gold-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </EliteLayout>
    );
  }

  if (error || !dashboard) {
    return (
      <EliteLayout user={user} onLogout={handleLogout}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 max-w-md text-center">
            <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">{error || 'Profile not found'}</p>
          </div>
        </div>
      </EliteLayout>
    );
  }

  const { player, pregameCues, weeklyReview, coachNotes, voiceNotes } = dashboard;

  // ---- RENDER ----

  return (
    <EliteLayout user={user} isEditing={isEditing} onLogout={handleLogout}>
      {/* ===== HERO SECTION ===== */}
      <div className="relative bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D] border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            {/* Player Image */}
            <div className="relative">
              {player.headshotUrl ? (
                <img
                  src={player.headshotUrl}
                  alt={player.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-gold-500/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 border-2 border-gold-500/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gold-500">
                    {player.firstName?.[0]}{player.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white tracking-tight">{player.name}</h1>
              <p className="text-lg text-gray-400 mt-0.5">{player.position} · {player.team}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-gold-500/20 text-gold-500 text-xs font-medium rounded-full uppercase tracking-wide">
                {player.seasonStatus.replace('-', ' ')}
              </span>
            </div>

            {/* Edit Toggle (Admin/Coach only) */}
            {canEdit && (
              <div className="flex items-center gap-4">
                <select
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-white text-sm"
                >
                  {COACHES.map(coach => (
                    <option key={coach} value={coach}>{coach}</option>
                  ))}
                </select>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'default' : 'outline'}
                  className={isEditing ? 'bg-gold-500 text-black' : ''}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Editing' : 'Edit'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== MAIN DASHBOARD ===== */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-7 space-y-8">

            {/* --- TODAY'S AGENDA --- */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Today&apos;s Agenda
                </h2>
                <span className="text-xs text-gray-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>

              {todaysSessions.length === 0 ? (
                <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] py-10 text-center">
                  <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No sessions scheduled today</p>
                  <p className="text-gray-700 text-xs mt-1">Check the calendar for upcoming sessions</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {todaysSessions.map(session => {
                    const typeInfo = getSessionTypeInfo(session.sessionType);
                    const TypeIcon = typeInfo.icon;
                    return (
                      <Link
                        key={session.id}
                        href={`/elite/${slug}/session/${session.id}`}
                        className="group"
                      >
                        <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-4 transition-all hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'p-2.5 rounded-xl border',
                              typeInfo.color
                            )}>
                              <TypeIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm">
                                {getAgendaLabel(session.sessionType)}
                              </p>
                              <p className="text-gray-500 text-xs mt-0.5 truncate">
                                {session.title}
                              </p>
                              {session.durationMinutes && (
                                <p className="text-gray-600 text-xs mt-1.5">
                                  {session.durationMinutes} min
                                </p>
                              )}
                            </div>
                            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* --- CALENDAR --- */}
            <section>
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {MONTHS[currentMonth]} {currentYear}
                  </h2>
                  <div className="flex items-center gap-2">
                    {canEdit && isEditing && (
                      <Link href={`/admin/players/${slug}/sessions`}>
                        <Button size="sm" variant="ghost" className="text-gold-500 text-xs">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Manage
                        </Button>
                      </Link>
                    )}
                    <button
                      onClick={nextMonth}
                      className="p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 px-3 pt-3">
                  {DAYS.map(day => (
                    <div key={day} className="text-center text-[11px] font-medium text-gray-600 py-2 uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 px-3 pb-3">
                  {calendarDays.map((day, idx) => {
                    if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;

                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const daySessions = getSessionsForDate(dateStr);
                    const isToday = dateStr === today;
                    const isSelected = dateStr === selectedDate;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={cn(
                          'aspect-square p-1 rounded-lg transition-all relative flex flex-col items-center justify-start pt-1.5',
                          isSelected
                            ? 'bg-gold-500/10 border border-gold-500/50'
                            : isToday
                              ? 'bg-gold-500/5 border border-gold-500/20'
                              : 'border border-transparent hover:bg-[#1A1A1A]',
                        )}
                      >
                        <span className={cn(
                          'text-xs font-medium',
                          isToday ? 'text-gold-500 font-bold' : isSelected ? 'text-white' : 'text-gray-400'
                        )}>
                          {day}
                        </span>

                        {daySessions.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                            {daySessions.slice(0, 3).map(s => (
                              <div
                                key={s.id}
                                className={cn('w-1.5 h-1.5 rounded-full', getSessionDotColor(s.sessionType))}
                              />
                            ))}
                            {daySessions.length > 3 && (
                              <span className="text-[8px] text-gray-500">+{daySessions.length - 3}</span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 px-5 py-3 border-t border-[#1A1A1A]">
                  {[
                    { color: 'bg-gold-500', label: 'Calibration' },
                    { color: 'bg-blue-500', label: 'Training' },
                    { color: 'bg-purple-500', label: 'Film' },
                    { color: 'bg-green-500', label: 'Recovery' },
                    { color: 'bg-red-500', label: 'Game' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className={cn('w-1.5 h-1.5 rounded-full', item.color)} />
                      <span className="text-[11px] text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Date Detail */}
              {selectedDate && (
                <div className="mt-4 rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A1A1A]">
                    <h3 className="text-sm font-semibold text-white">
                      {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                        weekday: 'long', month: 'short', day: 'numeric'
                      })}
                    </h3>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="p-1.5 rounded-lg hover:bg-[#1A1A1A] transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    {getSessionsForDate(selectedDate).length === 0 ? (
                      <p className="text-sm text-gray-600 text-center py-4">No sessions</p>
                    ) : (
                      <div className="space-y-2">
                        {getSessionsForDate(selectedDate).map(session => {
                          const typeInfo = getSessionTypeInfo(session.sessionType);
                          const TypeIcon = typeInfo.icon;
                          return (
                            <Link
                              key={session.id}
                              href={`/elite/${slug}/session/${session.id}`}
                              className="block"
                            >
                              <div className={cn(
                                'p-3 rounded-xl border transition-all hover:border-gold-500/30',
                                typeInfo.color
                              )}>
                                <div className="flex items-center gap-3">
                                  <TypeIcon className="w-4 h-4 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-white truncate">{session.title}</p>
                                    {session.durationMinutes && (
                                      <p className="text-xs text-gray-500 mt-0.5">{session.durationMinutes} min</p>
                                    )}
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-600" />
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* Daily Coach's Note (if visible to player) */}
                  {(() => {
                    const dailyNote = dailyNotes.find(n => n.date === selectedDate);
                    if (!dailyNote) return null;
                    return (
                      <div className="px-4 pb-4">
                        <div className="rounded-xl border border-gold-500/20 overflow-hidden">
                          <div className="px-4 py-2.5 bg-gold-500/5 border-b border-gold-500/10">
                            <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider">
                              Coach&apos;s Note
                            </span>
                          </div>
                          <div className="px-4 py-3">
                            <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                              {dailyNote.note}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </section>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="lg:col-span-5 space-y-6">

            {/* --- COACH NOTES --- */}
            <section>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Coach Notes
              </h2>
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-5">
                {/* Add Note (Admin/Coach edit mode) */}
                {canEdit && isEditing && (
                  <div className="mb-5 pb-5 border-b border-[#1A1A1A]">
                    <Textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      className="bg-[#0D0D0D] border-[#2A2A2A] text-white mb-2 resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={addCoachNote}
                      disabled={!newNote.trim() || saving}
                      size="sm"
                      className="bg-gold-500 text-black hover:bg-gold-600"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Note
                    </Button>
                  </div>
                )}

                {coachNotes.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">No notes yet</p>
                ) : (
                  <div className="space-y-3">
                    {coachNotes.slice(0, 6).map(note => (
                      <div key={note.id} className="flex items-start gap-3">
                        <span className="text-gold-500 mt-1.5 text-[8px]">●</span>
                        <div className="flex-1">
                          <p className="text-gray-200 text-sm leading-relaxed">{note.text}</p>
                          <p className="text-gray-600 text-xs mt-1">
                            {note.createdBy} · {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* --- PERFORMANCE REVIEW --- */}
            {weeklyReview && (
              <section>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Performance Review
                </h2>
                <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-5">
                  {/* What Changed */}
                  {weeklyReview.whatChanged.length > 0 && (
                    <div className="mb-5">
                      <h3 className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-3">
                        What Changed
                      </h3>
                      <div className="space-y-2">
                        {weeklyReview.whatChanged.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#0D0D0D] border border-[#1A1A1A]">
                            <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                              <TrendingUp className="w-3 h-3 text-gold-500" />
                            </div>
                            <p className="text-gray-200 text-sm leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Priorities */}
                  {weeklyReview.priorities.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                        Priorities
                      </h3>
                      <div className="space-y-2">
                        {weeklyReview.priorities.map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-400 text-xs font-bold">{i + 1}</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed pt-0.5">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* --- PRE-GAME CUES --- */}
            {pregameCues.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Pre-Game Cues
                </h2>
                <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-5 space-y-2">
                  {pregameCues.map((cue, i) => (
                    <div key={cue.id} className="flex items-start gap-3 py-1.5">
                      <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-gold-500 text-xs font-bold">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-200 text-sm leading-relaxed">{cue.text}</p>
                        <span className="text-[11px] text-gray-600 uppercase tracking-wide">{cue.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* --- VOICE NOTES --- */}
            {voiceNotes.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Voice Notes
                </h2>
                <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-4 space-y-2">
                  {voiceNotes.map(note => (
                    <div key={note.id} className="space-y-1">
                      <div className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#1A1A1A] transition-colors">
                        <button
                          onClick={() => togglePlayVoiceNote(note.id, note.url)}
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                            playingNoteId === note.id
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-[#1A1A1A] text-green-400 hover:bg-green-500/10'
                          )}
                        >
                          {playingNoteId === note.id ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{note.title}</p>
                          <p className="text-gray-600 text-xs">
                            {note.createdBy}
                            {note.duration ? ` · ${Math.floor(note.duration / 60)}:${(note.duration % 60).toString().padStart(2, '0')}` : ''}
                          </p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      {playingNoteId === note.id && (
                        <div className="mx-3 h-0.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-300"
                            style={{ width: `${noteProgress[note.id] || 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </EliteLayout>
  );
}

// ============================================
// PAGE EXPORT WITH SUSPENSE
// ============================================

export default function EliteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-gold-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      }
    >
      <EliteProfileContent />
    </Suspense>
  );
}
