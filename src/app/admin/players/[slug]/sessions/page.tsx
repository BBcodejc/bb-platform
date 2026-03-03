'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Save,
  Calendar,
  Loader2,
  ExternalLink,
  Target,
  Dumbbell,
  Film,
  Heart,
  ClipboardCheck,
  Trophy,
  ClipboardList,
  Eye,
  MessageSquare,
  EyeOff,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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
  createdBy?: string;
  createdAt: string;
}

interface PlayerInfo {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
}

interface DailyNote {
  id: string;
  playerId: string;
  date: string;
  note: string;
  visibleToPlayer: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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

export default function SessionCalendarPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  // Selected day
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Add session modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    sessionType: 'training',
    title: '',
    description: '',
    durationMinutes: '',
    location: '',
    opponent: '',
    focusAreas: '',
    notes: '',
    coachingNotes: '',
    coachingNotesVisible: false,
    link: '',
    createdBy: 'Coach Jake',
  });

  // Coaching notes inline edit state
  const [editingCoachingNotesId, setEditingCoachingNotesId] = useState<string | null>(null);
  const [editCoachingNotes, setEditCoachingNotes] = useState('');
  const [editCoachingNotesVisible, setEditCoachingNotesVisible] = useState(false);
  const [savingCoachingNotes, setSavingCoachingNotes] = useState(false);

  // Daily notes state
  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);
  const [editingDailyNote, setEditingDailyNote] = useState(false);
  const [dailyNoteText, setDailyNoteText] = useState('');
  const [dailyNoteVisible, setDailyNoteVisible] = useState(false);
  const [savingDailyNote, setSavingDailyNote] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [slug, currentMonth, currentYear]);

  // Reset daily note editing when selected date changes
  useEffect(() => {
    setEditingDailyNote(false);
  }, [selectedDate]);

  async function fetchSessions() {
    try {
      setLoading(true);
      const res = await fetch(`/api/elite-players/${slug}/sessions?month=${currentMonth + 1}&year=${currentYear}&context=admin`);
      if (res.ok) {
        const data = await res.json();
        setPlayer(data.player);
        setSessions(data.sessions || []);
        setDailyNotes(data.dailyNotes || []);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSession() {
    if (!newSession.title.trim() || !newSession.date) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSession,
          durationMinutes: newSession.durationMinutes ? parseInt(newSession.durationMinutes) : null,
          focusAreas: newSession.focusAreas ? newSession.focusAreas.split(',').map(s => s.trim()).filter(Boolean) : [],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Auto-set the link to the session detail page
        if (data.session?.id) {
          await fetch(`/api/elite-players/${slug}/sessions/${data.session.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link: `/elite/${slug}/session/${data.session.id}` }),
          }).catch(() => {});  // silent fail — link is optional
        }
        await fetchSessions();
        setShowAddModal(false);
        setNewSession({
          date: new Date().toISOString().split('T')[0],
          sessionType: 'training',
          title: '',
          description: '',
          durationMinutes: '',
          location: '',
          opponent: '',
          focusAreas: '',
          notes: '',
          coachingNotes: '',
          coachingNotesVisible: false,
          link: '',
          createdBy: 'Coach Jake',
        });
      }
    } catch (err) {
      console.error('Failed to add session:', err);
    } finally {
      setSaving(false);
    }
  }

  // Coaching notes inline edit handlers
  async function handleSaveCoachingNotes(sessionId: string) {
    setSavingCoachingNotes(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachingNotes: editCoachingNotes || null,
          coachingNotesVisible: editCoachingNotesVisible,
        }),
      });
      if (res.ok) {
        await fetchSessions();
        setEditingCoachingNotesId(null);
      }
    } catch (err) {
      console.error('Failed to save coaching notes:', err);
    } finally {
      setSavingCoachingNotes(false);
    }
  }

  function startEditingCoachingNotes(session: Session) {
    setEditingCoachingNotesId(session.id);
    setEditCoachingNotes(session.coachingNotes || '');
    setEditCoachingNotesVisible(session.coachingNotesVisible ?? false);
  }

  // Daily note helpers
  function getDailyNoteForDate(date: string): DailyNote | undefined {
    return dailyNotes.find(n => n.date === date);
  }

  function startEditingDailyNote(date: string) {
    const existing = getDailyNoteForDate(date);
    setEditingDailyNote(true);
    setDailyNoteText(existing?.note || '');
    setDailyNoteVisible(existing?.visibleToPlayer ?? false);
  }

  async function handleSaveDailyNote(date: string) {
    setSavingDailyNote(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/sessions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          note: dailyNoteText || null,
          visibleToPlayer: dailyNoteVisible,
          createdBy: 'Coach Jake',
        }),
      });
      if (res.ok) {
        await fetchSessions();
        setEditingDailyNote(false);
      }
    } catch (err) {
      console.error('Failed to save daily note:', err);
    } finally {
      setSavingDailyNote(false);
    }
  }

  // Calendar helpers
  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(month: number, year: number) {
    return new Date(year, month, 1).getDay();
  }

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

  function getSessionTypeInfo(type: string) {
    return SESSION_TYPES.find(t => t.value === type) || SESSION_TYPES[1];
  }

  function openAddForDate(date: string) {
    setNewSession(prev => ({ ...prev, date }));
    setShowAddModal(true);
  }

  // Build calendar grid
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const today = new Date().toISOString().split('T')[0];

  // Selected date sessions
  const selectedSessions = selectedDate ? getSessionsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/elite-players">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {player ? `${player.firstName} ${player.lastName}` : 'Loading...'} — Sessions
                </h1>
                <p className="text-sm text-gray-400">Training history & session calendar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/players/${slug}`}>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Edit Profile
                </Button>
              </Link>
              <Link href={`/admin/players/${slug}/postgame`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:bg-amber-500/10"
                >
                  <ClipboardList className="w-4 h-4 mr-1" />
                  Post-Game Analysis
                </Button>
              </Link>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gold-500 hover:bg-gold-600 text-black"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Session
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <button onClick={prevMonth} className="p-2 hover:bg-bb-dark rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <h2 className="text-xl font-bold text-white">
                    {MONTHS[currentMonth]} {currentYear}
                  </h2>
                  <button onClick={nextMonth} className="p-2 hover:bg-bb-dark rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAYS.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className="aspect-square" />;
                    }

                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const daySessions = getSessionsForDate(dateStr);
                    const isToday = dateStr === today;
                    const isSelected = dateStr === selectedDate;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        onDoubleClick={() => openAddForDate(dateStr)}
                        className={cn(
                          'aspect-square p-1 rounded-lg border transition-all relative group',
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10'
                            : isToday
                              ? 'border-gold-500/30 bg-gold-500/5'
                              : 'border-transparent hover:border-[#2A2A2A] hover:bg-[#111]',
                        )}
                      >
                        <span className={cn(
                          'text-xs font-medium block',
                          isToday ? 'text-gold-500' : 'text-gray-400'
                        )}>
                          {day}
                        </span>

                        {/* Session indicators */}
                        {daySessions.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mt-0.5">
                            {daySessions.slice(0, 3).map(s => {
                              const typeInfo = getSessionTypeInfo(s.sessionType);
                              return (
                                <div
                                  key={s.id}
                                  className={cn('w-1.5 h-1.5 rounded-full', typeInfo.color.split(' ')[0].replace('/20', ''))}
                                  title={s.title}
                                />
                              );
                            })}
                            {daySessions.length > 3 && (
                              <span className="text-[8px] text-gray-500">+{daySessions.length - 3}</span>
                            )}
                          </div>
                        )}

                        {/* Daily note indicator */}
                        {getDailyNoteForDate(dateStr) && (
                          <div className="absolute bottom-0.5 right-0.5">
                            <MessageSquare className="w-2.5 h-2.5 text-gold-500/60" />
                          </div>
                        )}

                        {/* Hover add button */}
                        <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-3 h-3 text-gray-600" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-bb-border">
                  {SESSION_TYPES.map(type => (
                    <div key={type.value} className="flex items-center gap-2">
                      <div className={cn('w-2.5 h-2.5 rounded-full', type.color.split(' ')[0].replace('/20', ''))} />
                      <span className="text-xs text-gray-500">{type.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Selected Day Details */}
          <div className="space-y-4">
            {selectedDate ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openAddForDate(selectedDate)}
                        className="text-gold-500"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedSessions.length === 0 ? (
                      <div className="text-center py-6">
                        <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No sessions this day</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openAddForDate(selectedDate)}
                          className="mt-2 text-gold-500"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Session
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedSessions.map(session => {
                          const typeInfo = getSessionTypeInfo(session.sessionType);
                          const TypeIcon = typeInfo.icon;
                          return (
                            <div
                              key={session.id}
                              className={cn('p-3 rounded-xl border', typeInfo.color)}
                            >
                              <div className="flex items-start gap-3">
                                <TypeIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-white">{session.title}</p>
                                  {session.opponent && (
                                    <p className="text-xs text-gray-400 mt-0.5">vs {session.opponent}</p>
                                  )}
                                  {session.durationMinutes && (
                                    <p className="text-xs text-gray-500 mt-0.5">{session.durationMinutes} min</p>
                                  )}
                                  {session.notes && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{session.notes}</p>
                                  )}
                                  {session.focusAreas.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {session.focusAreas.map(area => (
                                        <span key={area} className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded text-gray-300">
                                          {area}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {/* View Session detail page */}
                                    <Link
                                      href={`/elite/${slug}/session/${session.id}`}
                                      target="_blank"
                                      className="inline-flex items-center gap-1 text-xs text-gold-500 hover:underline"
                                    >
                                      <Eye className="w-3 h-3" />
                                      View Session
                                    </Link>
                                    {session.link && (
                                      <Link
                                        href={session.link}
                                        target="_blank"
                                        className="inline-flex items-center gap-1 text-xs text-gold-500 hover:underline"
                                      >
                                        Open <ExternalLink className="w-3 h-3" />
                                      </Link>
                                    )}
                                    {session.sessionType === 'game' && (
                                      <Link
                                        href={`/admin/players/${slug}/postgame?date=${session.date}&opponent=${encodeURIComponent(session.opponent || '')}`}
                                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline"
                                      >
                                        <ClipboardList className="w-3 h-3" />
                                        Post-Game Analysis
                                      </Link>
                                    )}
                                    {session.sessionType === 'postgame' && session.link && (
                                      <Link
                                        href={session.link}
                                        target="_blank"
                                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline"
                                      >
                                        <ClipboardList className="w-3 h-3" />
                                        View Report
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {session.createdBy && (
                                <p className="text-[10px] text-gray-600 mt-2">{session.createdBy}</p>
                              )}

                              {/* Coaching Notes Section */}
                              <div className="mt-3 pt-3 border-t border-black/20">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <MessageSquare className="w-3 h-3 text-gray-500" />
                                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Coaching Notes
                                  </span>
                                  {editingCoachingNotesId !== session.id && (
                                    <>
                                      {session.coachingNotesVisible ? (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">
                                          Player Visible
                                        </span>
                                      ) : (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-500 border border-gray-700">
                                          Internal
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>

                                {editingCoachingNotesId === session.id ? (
                                  <div className="space-y-2">
                                    <textarea
                                      value={editCoachingNotes}
                                      onChange={(e) => setEditCoachingNotes(e.target.value)}
                                      rows={3}
                                      className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[#2A2A2A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
                                      placeholder="Add coaching notes..."
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <button
                                        type="button"
                                        onClick={() => setEditCoachingNotesVisible(!editCoachingNotesVisible)}
                                        className={cn(
                                          'w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0',
                                          editCoachingNotesVisible
                                            ? 'bg-gold-500 border-gold-500'
                                            : 'border-gray-600 hover:border-gold-500/50'
                                        )}
                                      >
                                        {editCoachingNotesVisible && <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />}
                                      </button>
                                      <span className="text-[10px] text-gray-400">Show on player&apos;s calendar</span>
                                    </label>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleSaveCoachingNotes(session.id)}
                                        disabled={savingCoachingNotes}
                                        className="text-[10px] px-2.5 py-1 rounded bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-colors disabled:opacity-50"
                                      >
                                        {savingCoachingNotes ? 'Saving...' : 'Save'}
                                      </button>
                                      <button
                                        onClick={() => setEditingCoachingNotesId(null)}
                                        className="text-[10px] px-2.5 py-1 rounded bg-gray-700/30 text-gray-500 hover:bg-gray-700/50 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    {session.coachingNotes ? (
                                      <p className="text-xs text-gray-400 line-clamp-3 whitespace-pre-wrap">{session.coachingNotes}</p>
                                    ) : (
                                      <p className="text-xs text-gray-600 italic">No coaching notes yet</p>
                                    )}
                                    <button
                                      onClick={() => startEditingCoachingNotes(session)}
                                      className="text-[10px] text-gold-500 hover:underline mt-1"
                                    >
                                      {session.coachingNotes ? 'Edit' : 'Add Notes'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Daily Coach's Note */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <CardTitle className="text-sm">Coach&apos;s Daily Note</CardTitle>
                      {!editingDailyNote && (() => {
                        const existing = getDailyNoteForDate(selectedDate);
                        return existing?.visibleToPlayer ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">
                            Player Visible
                          </span>
                        ) : existing ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-500 border border-gray-700">
                            Internal
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingDailyNote ? (
                      <div className="space-y-2">
                        <textarea
                          value={dailyNoteText}
                          onChange={(e) => setDailyNoteText(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-[#2A2A2A] text-white text-xs focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
                          placeholder="Add a note for this day..."
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <button
                            type="button"
                            onClick={() => setDailyNoteVisible(!dailyNoteVisible)}
                            className={cn(
                              'w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0',
                              dailyNoteVisible
                                ? 'bg-gold-500 border-gold-500'
                                : 'border-gray-600 hover:border-gold-500/50'
                            )}
                          >
                            {dailyNoteVisible && <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />}
                          </button>
                          <span className="text-[10px] text-gray-400">Show on player&apos;s calendar</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveDailyNote(selectedDate)}
                            disabled={savingDailyNote}
                            className="text-[10px] px-2.5 py-1 rounded bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-colors disabled:opacity-50"
                          >
                            {savingDailyNote ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingDailyNote(false)}
                            className="text-[10px] px-2.5 py-1 rounded bg-gray-700/30 text-gray-500 hover:bg-gray-700/50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {(() => {
                          const existing = getDailyNoteForDate(selectedDate);
                          return existing ? (
                            <>
                              <p className="text-xs text-gray-400 whitespace-pre-wrap">{existing.note}</p>
                              <p className="text-[10px] text-gray-600 mt-1">{existing.createdBy}</p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-600 italic">No daily note</p>
                          );
                        })()}
                        <button
                          onClick={() => startEditingDailyNote(selectedDate)}
                          className="text-[10px] text-gold-500 hover:underline mt-1"
                        >
                          {getDailyNoteForDate(selectedDate) ? 'Edit' : 'Add Note'}
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Click a day to view sessions</p>
                  <p className="text-gray-600 text-xs mt-1">Double-click to add</p>
                </CardContent>
              </Card>
            )}

            {/* Recent sessions list */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No sessions this month</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.slice(0, 10).map(session => {
                      const typeInfo = getSessionTypeInfo(session.sessionType);
                      return (
                        <button
                          key={session.id}
                          onClick={() => setSelectedDate(session.date)}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-bb-dark/50 transition-colors text-left"
                        >
                          <span className={cn('text-xs px-2 py-0.5 rounded-full border', typeInfo.color)}>
                            {typeInfo.label}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{session.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(session.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#2A2A2A]">
              <div>
                <h3 className="text-lg font-bold text-white">Add Session</h3>
                <p className="text-xs text-gray-500 mt-0.5">Create a training session, pre-game routine, or non-game day outline</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-[#2A2A2A] rounded">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Row 1: Date, Type, Opponent */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                  <Input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className="bg-bb-dark/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                  <select
                    value={newSession.sessionType}
                    onChange={(e) => setNewSession({ ...newSession, sessionType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bb-dark/50 border border-bb-border text-white text-sm"
                  >
                    {SESSION_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Opponent</label>
                  <Input
                    value={newSession.opponent}
                    onChange={(e) => setNewSession({ ...newSession, opponent: e.target.value })}
                    placeholder="e.g., Knicks"
                    className="bg-bb-dark/50"
                  />
                </div>
              </div>

              {/* Row 2: Title */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <Input
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  placeholder="e.g., Deep Distance + Back Rim + Cognitive + Live"
                  className="bg-bb-dark/50"
                />
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description (short summary)</label>
                <Input
                  value={newSession.description || ''}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  placeholder="e.g., Focus: Back rim mastery, deep distance impulse, cognitive stress"
                  className="bg-bb-dark/50"
                />
              </div>

              {/* Row 4: Location, Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                  <Input
                    value={newSession.location}
                    onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                    placeholder="e.g., SDA, USD, Home court"
                    className="bg-bb-dark/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Duration (min)</label>
                  <Input
                    type="number"
                    value={newSession.durationMinutes}
                    onChange={(e) => setNewSession({ ...newSession, durationMinutes: e.target.value })}
                    placeholder="45"
                    className="bg-bb-dark/50"
                  />
                </div>
              </div>

              {/* Row 5: Focus Areas */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Focus Areas (comma-separated)</label>
                <Input
                  value={newSession.focusAreas}
                  onChange={(e) => setNewSession({ ...newSession, focusAreas: e.target.value })}
                  placeholder="back-rim, deep-distance, cognitive, live-play"
                  className="bg-bb-dark/50"
                />
              </div>

              {/* Row 6: SESSION OUTLINE — the big text area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-500">Session Outline</label>
                  <span className="text-[10px] text-gray-600">Lines starting with SEGMENT create headers · Lines starting with • - * become checkboxes</span>
                </div>
                <Textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  placeholder={`SEGMENT 1: DEEP DISTANCE (7-10 min)\nPrinciples to focus on:\n• Get off the ground\n• 10 rim hits from deep line\n• 10 one step in back rim miss or makes only\n\nSEGMENT 2: 3 POINT LINE — 5 SECTION\nPrinciples to focus on:\n• Back Rim\n• 3 in a Row Back Rim Miss or make\n• Progressed with regular ball/strobes`}
                  rows={14}
                  className="bg-bb-dark/50 font-mono text-sm leading-relaxed"
                />
                <div className="mt-2 p-3 rounded-lg bg-[#0D0D0D] border border-[#1A1A1A]">
                  <p className="text-[10px] text-gray-600 font-medium mb-1.5">FORMATTING GUIDE</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-gray-500">
                    <div><span className="text-gold-500/70 font-mono">SEGMENT 1: TITLE</span> → Section header</div>
                    <div><span className="text-gold-500/70 font-mono">• Bullet item</span> → Interactive checkbox</div>
                    <div><span className="text-gold-500/70 font-mono">- Bullet item</span> → Interactive checkbox</div>
                    <div><span className="text-gold-500/70 font-mono">* Bullet item</span> → Interactive checkbox</div>
                    <div><span className="text-gold-500/70 font-mono">Sub-header:</span> → Sub-header (ends with colon)</div>
                    <div><span className="text-gold-500/70 font-mono">Regular text</span> → Plain text line</div>
                  </div>
                </div>
              </div>

              {/* Row 7: COACHING NOTES */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-500">Coaching Notes</label>
                  <span className="text-[10px] text-gray-600">Internal by default — only visible to coaches</span>
                </div>
                <Textarea
                  value={newSession.coachingNotes}
                  onChange={(e) => setNewSession({ ...newSession, coachingNotes: e.target.value })}
                  placeholder="e.g., Need to explore getting off ground rapid on pull-ups. Watch for energy drift pattern on step-backs..."
                  rows={4}
                  className="bg-bb-dark/50 text-sm"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setNewSession({ ...newSession, coachingNotesVisible: !newSession.coachingNotesVisible })}
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0',
                      newSession.coachingNotesVisible
                        ? 'bg-gold-500 border-gold-500'
                        : 'border-gray-600 hover:border-gold-500/50'
                    )}
                  >
                    {newSession.coachingNotesVisible && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                  </button>
                  <span className="text-xs text-gray-400">Show on player&apos;s calendar</span>
                  {newSession.coachingNotesVisible ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">
                      Player Visible
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-500 border border-gray-700">
                      Internal Only
                    </span>
                  )}
                </label>
              </div>

              {/* Link field (hidden, auto-generated) */}
              <input type="hidden" value={newSession.link} />

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSession}
                  disabled={saving || !newSession.title.trim()}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-black"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" />Save Session</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
