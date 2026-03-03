'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  Dumbbell,
  Film,
  Heart,
  ClipboardCheck,
  Trophy,
  ClipboardList,
  MapPin,
  Clock,
  User,
  Calendar,
  Loader2,
  CheckCircle2,
  Circle,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentUser, canEditElite, type AuthUser } from '@/lib/middleware/auth';

interface SessionData {
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

const SESSION_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  'pre-game': { label: 'Pre-Game', icon: Target, color: 'text-gold-400', bgColor: 'bg-gold-500/10 border-gold-500/20' },
  'training': { label: 'Training', icon: Dumbbell, color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20' },
  'film': { label: 'Film', icon: Film, color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/20' },
  'recovery': { label: 'Recovery', icon: Heart, color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/20' },
  'evaluation': { label: 'Evaluation', icon: ClipboardCheck, color: 'text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/20' },
  'game': { label: 'Game', icon: Trophy, color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/20' },
  'postgame': { label: 'Post-Game', icon: ClipboardList, color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20' },
};

// Parse notes into structured segments
function parseSessionNotes(notes: string): { segments: { title: string; content: string[] }[], rawLines: string[] } {
  if (!notes) return { segments: [], rawLines: [] };

  const lines = notes.split('\n').filter(l => l.trim());
  const segments: { title: string; content: string[] }[] = [];
  let currentSegment: { title: string; content: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect segment headers — lines starting with "SEGMENT" or all-caps lines or numbered segments like "1." "2."
    const isSegmentHeader =
      /^SEGMENT\s+\d/i.test(trimmed) ||
      /^\d+\.\s+/.test(trimmed) && trimmed === trimmed.toUpperCase() ||
      /^(PART\s+[A-Z]|SECTION\s+\d)/i.test(trimmed);

    if (isSegmentHeader) {
      if (currentSegment) {
        segments.push(currentSegment);
      }
      currentSegment = { title: trimmed, content: [] };
    } else if (currentSegment) {
      currentSegment.content.push(trimmed);
    } else {
      // Lines before any segment header
      if (!currentSegment) {
        currentSegment = { title: '', content: [trimmed] };
      }
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return { segments, rawLines: lines };
}

export default function SessionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Auth state
  const [canEdit, setCanEdit] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const result = await getCurrentUser();
      if (result.isAuthenticated && result.user) {
        setCanEdit(canEditElite(result.user.role));
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    fetchSession();
  }, [slug, sessionId]);

  async function fetchSession() {
    try {
      setLoading(true);
      const res = await fetch(`/api/elite-players/${slug}/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
        setPlayer(data.player);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Failed to fetch session:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function startEditing() {
    setEditingNotes(session?.notes || '');
    setIsEditing(true);
  }

  async function saveNotes() {
    if (!session) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editingNotes }),
      });
      if (res.ok) {
        setSession({ ...session, notes: editingNotes });
        setIsEditing(false);
        setCompleted(new Set());
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (error || !session || !player) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Session not found</p>
          <Link href={`/elite/${slug}`} className="text-gold-500 text-sm hover:underline mt-2 inline-block">
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = SESSION_TYPE_CONFIG[session.sessionType] || SESSION_TYPE_CONFIG['training'];
  const TypeIcon = typeConfig.icon;
  const parsed = parseSessionNotes(session.notes || '');

  const gameDate = new Date(session.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Count all bullet items for progress
  const allItems = parsed.segments.flatMap((seg, si) =>
    seg.content.filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*')).map((l, li) => `${si}-${li}`)
  );
  const progressPercent = allItems.length > 0 ? Math.round((completed.size / allItems.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#141414] to-[#0A0A0A] border-b border-[#1A1A1A]">
        <div className="max-w-2xl mx-auto px-5 pt-6 pb-8">
          <div className="mb-6" />

          {/* Session Type Badge */}
          <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4', typeConfig.bgColor)}>
            <TypeIcon className={cn('w-4 h-4', typeConfig.color)} />
            <span className={cn('text-sm font-semibold uppercase tracking-wider', typeConfig.color)}>
              {typeConfig.label}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white">{session.title}</h1>
            {canEdit && !isEditing && (
              <button
                onClick={startEditing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-gray-400 hover:text-white hover:border-gold-500/30 transition-all text-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          {session.description && (
            <p className="text-gray-400 text-sm mb-4">{session.description}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{gameDate}</span>
            </div>
            {session.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{session.location}</span>
              </div>
            )}
            {session.opponent && (
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>vs {session.opponent}</span>
              </div>
            )}
            {session.durationMinutes && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{session.durationMinutes} min</span>
              </div>
            )}
            {session.createdBy && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{session.createdBy}</span>
              </div>
            )}
          </div>

          {/* Focus Areas */}
          {session.focusAreas && session.focusAreas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {session.focusAreas.map(area => (
                <span
                  key={area}
                  className="px-2.5 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-medium border border-gold-500/20"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar (if there are checkable items) */}
      {allItems.length > 0 && (
        <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#1A1A1A]">
          <div className="max-w-2xl mx-auto px-5 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">
                {completed.size} / {allItems.length} completed
              </span>
              <span className="text-xs font-bold text-gold-500">{progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Session Content */}
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">

        {/* Edit Mode */}
        {isEditing && (
          <div className="rounded-2xl border border-gold-500/20 bg-[#111] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
              <h2 className="text-sm font-bold text-gold-400 uppercase tracking-wider">Edit Session Notes</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-gray-400 hover:text-white transition-all text-sm"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={saveNotes}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-all text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <div className="p-5">
              <textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                className="w-full min-h-[400px] bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-gold-500/40 resize-y"
                placeholder="Session notes..."
              />
              <p className="text-xs text-gray-600 mt-2">
                Use section headers in ALL CAPS, bullet points with &bull; for checklist items.
              </p>
            </div>
          </div>
        )}

        {/* Read Mode */}
        {!isEditing && parsed.segments.map((segment, si) => (
          <div key={si} className="rounded-2xl border border-[#1A1A1A] overflow-hidden">
            {/* Segment Header */}
            {segment.title && (
              <div className="px-5 py-4 bg-[#111] border-b border-[#1A1A1A]">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {segment.title}
                </h2>
              </div>
            )}

            {/* Segment Content */}
            <div className="px-5 py-4 space-y-2">
              {segment.content.map((line, li) => {
                const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
                const itemId = `${si}-${li}`;
                const isChecked = completed.has(itemId);
                const bulletText = isBullet ? line.replace(/^[•\-\*]\s*/, '') : line;

                // Sub-headers (lines that end with : or are all caps-ish)
                const isSubHeader = !isBullet && (
                  line.endsWith(':') ||
                  (line === line.toUpperCase() && line.length > 3 && !line.startsWith('OR'))
                );

                if (isSubHeader) {
                  return (
                    <div key={li} className="pt-3 pb-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {line}
                      </p>
                    </div>
                  );
                }

                if (isBullet) {
                  return (
                    <button
                      key={li}
                      onClick={() => toggle(itemId)}
                      className={cn(
                        'w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left',
                        isChecked
                          ? 'bg-gold-500/5'
                          : 'hover:bg-[#111]'
                      )}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={cn(
                        'text-sm transition-colors',
                        isChecked ? 'text-gray-500 line-through' : 'text-white'
                      )}>
                        {bulletText}
                      </span>
                    </button>
                  );
                }

                // Regular text line
                return (
                  <p key={li} className="text-sm text-gray-300 py-1 pl-1">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        ))}

        {/* If no parsed segments, show raw notes */}
        {!isEditing && parsed.segments.length === 0 && session.notes && (
          <div className="rounded-2xl border border-[#1A1A1A] p-5">
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{session.notes}</p>
          </div>
        )}

        {/* Coach's Notes (only shown when API returns them — i.e. coaching_notes_visible = true) */}
        {!isEditing && session.coachingNotes && (
          <div className="rounded-2xl border border-gold-500/20 overflow-hidden">
            <div className="px-5 py-4 bg-gold-500/5 border-b border-gold-500/10">
              <h2 className="text-sm font-bold text-gold-400 uppercase tracking-wider">
                Coach&apos;s Notes
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {session.coachingNotes}
              </p>
            </div>
          </div>
        )}

        {/* Game stats for game-type sessions */}
        {!isEditing && session.sessionType === 'game' && session.notes && (
          <div className="rounded-2xl border border-[#1A1A1A] overflow-hidden">
            <div className="px-5 py-4 bg-[#111] border-b border-[#1A1A1A]">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Game Stats</h2>
            </div>
            <div className="px-5 py-6">
              <div className="flex items-center justify-center gap-8">
                {/* Parse 3PT: X/Y | PTS: Z format */}
                {session.notes.includes('3PT:') && (() => {
                  const match3pt = session.notes!.match(/3PT:\s*(\d+)\/(\d+)/);
                  const matchPts = session.notes!.match(/PTS:\s*(\d+)/);
                  const makes = match3pt ? parseInt(match3pt[1]) : 0;
                  const attempts = match3pt ? parseInt(match3pt[2]) : 0;
                  const pct = attempts > 0 ? ((makes / attempts) * 100).toFixed(1) : '0.0';
                  const pts = matchPts ? parseInt(matchPts[1]) : 0;

                  return (
                    <>
                      <div className="text-center">
                        <p className="text-4xl font-bold text-white">{makes}/{attempts}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase">3-Point</p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-bold text-gold-500">{pct}%</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase">3PT%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-bold text-white">{pts}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase">Points</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Completion badge */}
        {!isEditing && allItems.length > 0 && progressPercent === 100 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gold-500/10 border border-gold-500/20">
              <CheckCircle2 className="w-6 h-6 text-gold-500" />
              <span className="text-gold-500 font-bold">Session Complete</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] py-6">
        <div className="max-w-2xl mx-auto px-5 flex items-center justify-center gap-2 text-gray-600 text-xs">
          <Target className="w-3.5 h-3.5" />
          <span>Basketball Biomechanics</span>
        </div>
      </footer>
    </div>
  );
}
