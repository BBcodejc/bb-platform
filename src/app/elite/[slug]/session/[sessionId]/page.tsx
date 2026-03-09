'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Upload,
  Video,
  ExternalLink,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentUser, canEditElite, type AuthUser } from '@/lib/middleware/auth';
import { BLOCK_CATEGORY_CONFIG } from '@/types/session-library';
import type { SessionPlanWithBlocks, SessionBlock } from '@/types/session-library';

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
  videoUrl?: string;
  videoUrlClient?: string;
  bestTestOfDay?: string;
  sessionPlanId?: string;
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

// Render block description with external cues highlighted in gold
function renderBlockDescription(description: string, externalCues: string[]): React.ReactNode {
  if (!description) return null;
  if (!externalCues || externalCues.length === 0) {
    return description;
  }

  // Split the description into parts, highlighting cue text
  const parts: React.ReactNode[] = [];
  const lines = description.split('\n');

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) parts.push('\n');

    // Check if this line contains "External cue:" pattern
    const cueMatch = line.match(/External cue:\s*(.*)/i);
    if (cueMatch) {
      const beforeCue = line.substring(0, line.indexOf(cueMatch[0]));
      parts.push(beforeCue);
      parts.push(
        <span key={`cue-label-${lineIndex}`} className="text-gold-400 font-medium">
          External cue: {cueMatch[1]}
        </span>
      );
    } else {
      // Check if any cue string appears in this line
      let hasHighlight = false;
      for (const cue of externalCues) {
        const idx = line.toLowerCase().indexOf(cue.toLowerCase());
        if (idx >= 0) {
          parts.push(line.substring(0, idx));
          parts.push(
            <span key={`cue-${lineIndex}`} className="text-gold-400 font-medium">
              {line.substring(idx, idx + cue.length)}
            </span>
          );
          parts.push(line.substring(idx + cue.length));
          hasHighlight = true;
          break;
        }
      }
      if (!hasHighlight) {
        parts.push(line);
      }
    }
  });

  return <>{parts}</>;
}

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Session plan state (block-based view)
  const [sessionPlan, setSessionPlan] = useState<SessionPlanWithBlocks | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [playerNotes, setPlayerNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingBlock, setSavingBlock] = useState<string | null>(null);

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Video upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Check authentication — dual auth (Supabase admin OR elite token)
  useEffect(() => {
    async function checkAuth() {
      // First try Supabase admin auth
      const result = await getCurrentUser();
      if (result.isAuthenticated && result.user) {
        setCanEdit(canEditElite(result.user.role));
        setAuthChecked(true);
        return;
      }
      // Then try elite token auth
      try {
        const res = await fetch(`/api/elite/auth/verify?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.valid) {
            setCanEdit(false);
            setAuthChecked(true);
            return;
          }
        }
      } catch {}
      // No auth — redirect to elite login
      router.push(`/elite/login?redirect=/elite/${slug}/session/${sessionId}`);
    }
    checkAuth();
  }, [slug, sessionId, router]);

  useEffect(() => {
    fetchSession();
  }, [slug, sessionId]);

  async function fetchSession() {
    try {
      setLoading(true);
      // Use the elite token-auth endpoint (not admin-only)
      const res = await fetch(`/api/elite/${slug}/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
        setPlayer(data.player);

        // If session has a linked plan, fetch block details
        if (data.session.sessionPlanId) {
          fetchSessionPlan(data.session.sessionPlanId);
        }
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

  async function fetchSessionPlan(planId: string) {
    try {
      setPlanLoading(true);
      const res = await fetch(`/api/elite/${slug}/session-plans/${planId}`);
      if (res.ok) {
        const data = await res.json();
        setSessionPlan(data.plan);
        setPlayerNotes(data.plan.playerNotes || '');
      }
    } catch (err) {
      console.error('Failed to fetch session plan:', err);
    } finally {
      setPlanLoading(false);
    }
  }

  async function toggleBlockComplete(blockId: string) {
    if (!sessionPlan) return;
    setSavingBlock(blockId);

    const isCompleted = sessionPlan.completedBlocks.includes(blockId);
    const newCompleted = isCompleted
      ? sessionPlan.completedBlocks.filter(b => b !== blockId)
      : [...sessionPlan.completedBlocks, blockId];

    const allDone = newCompleted.length === sessionPlan.blockIds.length;
    const newStatus = allDone ? 'completed' : newCompleted.length > 0 ? 'in_progress' : 'assigned';

    // Optimistic update
    setSessionPlan({
      ...sessionPlan,
      completedBlocks: newCompleted,
      status: newStatus as any,
    });

    try {
      await fetch(`/api/elite/${slug}/session-plans/${sessionPlan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedBlocks: newCompleted,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.error('Failed to update block completion:', err);
      // Revert on error
      setSessionPlan({
        ...sessionPlan,
        completedBlocks: sessionPlan.completedBlocks,
        status: sessionPlan.status,
      });
    } finally {
      setSavingBlock(null);
    }
  }

  async function savePlayerNotes() {
    if (!sessionPlan) return;
    setSavingNotes(true);
    try {
      await fetch(`/api/elite/${slug}/session-plans/${sessionPlan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerNotes }),
      });
      setSessionPlan({ ...sessionPlan, playerNotes });
    } catch (err) {
      console.error('Failed to save player notes:', err);
    } finally {
      setSavingNotes(false);
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

  // Client video upload
  async function handleVideoUpload(file: File) {
    const allowedTypes = ['video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Use MP4 or MOV.');
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      setUploadError('File too large. Max 200MB.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 500);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/elite/${slug}/sessions/${sessionId}/upload`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const { url } = await res.json();
      setUploadProgress(100);
      setUploadSuccess('Video uploaded successfully!');

      // Update session state with the new client video
      if (session) {
        setSession({ ...session, videoUrlClient: url });
      }
    } catch (err: any) {
      console.error('Video upload error:', err);
      setUploadError(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadSuccess(null), 4000);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleVideoUpload(file);
  }

  if (loading || !authChecked) {
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

      {/* Progress Bar — block-based or legacy bullet-based */}
      {sessionPlan ? (() => {
        const blockProgress = sessionPlan.blocks.length > 0
          ? Math.round((sessionPlan.completedBlocks.length / sessionPlan.blocks.length) * 100)
          : 0;
        return (
          <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#1A1A1A]">
            <div className="max-w-2xl mx-auto px-5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">
                  {sessionPlan.completedBlocks.length} / {sessionPlan.blocks.length} blocks completed
                </span>
                <span className="text-xs font-bold text-gold-500">{blockProgress}%</span>
              </div>
              <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
                  style={{ width: `${blockProgress}%` }}
                />
              </div>
            </div>
          </div>
        );
      })() : allItems.length > 0 && (
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

        {/* Best Test of the Day — prominent gold callout */}
        {!isEditing && session.bestTestOfDay && (
          <div className="rounded-2xl border-2 border-gold-500/30 overflow-hidden bg-gradient-to-br from-gold-500/10 to-gold-500/5">
            <div className="px-5 py-4 border-b border-gold-500/20 flex items-center gap-2">
              <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
              <h2 className="text-sm font-bold text-gold-400 uppercase tracking-wider">
                Best Test of the Day
              </h2>
              <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
            </div>
            <div className="px-5 py-5">
              <p className="text-base text-white font-medium leading-relaxed whitespace-pre-wrap">
                {session.bestTestOfDay}
              </p>
            </div>
          </div>
        )}

        {/* Coach Exercise Video (from coach) */}
        {!isEditing && session.videoUrl && (
          <div className="rounded-2xl border border-blue-500/20 overflow-hidden">
            <div className="px-5 py-4 bg-blue-500/5 border-b border-blue-500/10 flex items-center gap-2">
              <Film className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                Exercise Video
              </h2>
            </div>
            <div className="p-4">
              <video
                src={session.videoUrl}
                controls
                className="w-full rounded-xl"
                preload="metadata"
              />
            </div>
          </div>
        )}

        {/* ========== BLOCK-BASED SESSION VIEW ========== */}
        {!isEditing && sessionPlan && (
          <>
            {/* Loading state for plan */}
            {planLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
              </div>
            )}

            {/* Coaching Notes (from coach for this plan) */}
            {sessionPlan.coachingNotes && (
              <div className="rounded-2xl border border-gold-500/20 overflow-hidden">
                <div className="px-5 py-4 bg-gold-500/5 border-b border-gold-500/10">
                  <h2 className="text-sm font-bold text-gold-400 uppercase tracking-wider">
                    Coach&apos;s Notes
                  </h2>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {sessionPlan.coachingNotes}
                  </p>
                </div>
              </div>
            )}

            {/* Ordered Block Cards */}
            {sessionPlan.blocks.map((block, index) => {
              const catConfig = BLOCK_CATEGORY_CONFIG[block.category] || BLOCK_CATEGORY_CONFIG.shooting;
              const isExpanded = expandedBlock === block.blockId;
              const isCompleted = sessionPlan.completedBlocks.includes(block.blockId);
              const blockNote = sessionPlan.blockNotes?.[block.blockId];

              return (
                <div
                  key={`${block.blockId}-${index}`}
                  className={cn(
                    'rounded-2xl border overflow-hidden transition-all',
                    isCompleted
                      ? 'border-gold-500/20 bg-gold-500/5'
                      : 'border-[#1A1A1A]'
                  )}
                >
                  {/* Block Header — always visible */}
                  <div
                    className="px-5 py-4 flex items-center gap-3 cursor-pointer"
                    onClick={() => setExpandedBlock(isExpanded ? null : block.blockId)}
                  >
                    {/* Completion checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBlockComplete(block.blockId);
                      }}
                      disabled={savingBlock === block.blockId}
                      className="flex-shrink-0"
                    >
                      {savingBlock === block.blockId ? (
                        <Loader2 className="w-5 h-5 text-gold-500 animate-spin" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-gold-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400 transition-colors" />
                      )}
                    </button>

                    {/* Block ID badge */}
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-bold border',
                      catConfig.bgColor,
                      catConfig.color
                    )}>
                      {block.blockId}
                    </span>

                    {/* Block info */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        isCompleted ? 'text-gray-500 line-through' : 'text-white'
                      )}>
                        {block.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {block.durationDisplay}
                        </span>
                        {block.equipment.length > 0 && (
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <Wrench className="w-3 h-3" />
                            {block.equipment.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand chevron */}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4 border-t border-[#1A1A1A]">
                      {/* Equipment pills */}
                      {block.equipment.length > 0 && (
                        <div className="pt-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Equipment</p>
                          <div className="flex flex-wrap gap-2">
                            {block.equipment.map(eq => (
                              <span
                                key={eq}
                                className="px-2.5 py-1 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs text-gray-400"
                              >
                                {eq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Constraint Level Indicator */}
                      {(block.constraintLevelMin || block.constraintLevelMax) && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Constraint Level</p>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5, 6].map(level => {
                              const min = block.constraintLevelMin || 1;
                              const max = block.constraintLevelMax || 6;
                              const isActive = level >= min && level <= max;
                              return (
                                <div
                                  key={level}
                                  className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                                    isActive
                                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                                      : 'bg-[#1A1A1A] text-gray-600 border border-[#2A2A2A]'
                                  )}
                                >
                                  {level}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Full description with external cues highlighted */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Instructions</p>
                        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {renderBlockDescription(block.description, block.externalCues)}
                        </div>
                      </div>

                      {/* Per-block coach note */}
                      {blockNote && (
                        <div className="rounded-xl bg-gold-500/5 border border-gold-500/20 px-4 py-3">
                          <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1">Coach Note</p>
                          <p className="text-sm text-gray-300">{blockNote}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Player Notes Textarea */}
            <div className="rounded-2xl border border-[#1A1A1A] overflow-hidden">
              <div className="px-5 py-4 bg-[#111] border-b border-[#1A1A1A] flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Your Notes
                </h2>
                {playerNotes !== (sessionPlan.playerNotes || '') && (
                  <button
                    onClick={savePlayerNotes}
                    disabled={savingNotes}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 transition-all text-sm disabled:opacity-50"
                  >
                    {savingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {savingNotes ? 'Saving...' : 'Save'}
                  </button>
                )}
              </div>
              <div className="p-5">
                <textarea
                  value={playerNotes}
                  onChange={(e) => setPlayerNotes(e.target.value)}
                  onBlur={() => {
                    if (playerNotes !== (sessionPlan.playerNotes || '')) {
                      savePlayerNotes();
                    }
                  }}
                  className="w-full min-h-[120px] bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 text-sm text-white leading-relaxed focus:outline-none focus:border-gold-500/40 resize-y"
                  placeholder="What felt difficult? What broke down? Any observations..."
                />
              </div>
            </div>

            {/* Complete Session badge */}
            {sessionPlan.completedBlocks.length === sessionPlan.blocks.length && sessionPlan.blocks.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gold-500/10 border border-gold-500/20">
                  <CheckCircle2 className="w-6 h-6 text-gold-500" />
                  <span className="text-gold-500 font-bold">Session Complete</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========== LEGACY NOTES-BASED VIEW ========== */}
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

        {/* Read Mode — only show legacy segments when no block-based plan */}
        {!isEditing && !sessionPlan && parsed.segments.map((segment, si) => (
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

        {/* If no parsed segments, show raw notes (only when no block-based plan) */}
        {!isEditing && !sessionPlan && parsed.segments.length === 0 && session.notes && (
          <div className="rounded-2xl border border-[#1A1A1A] p-5">
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{session.notes}</p>
          </div>
        )}

        {/* Coach's Notes — only in legacy view (block view shows coaching notes inline) */}
        {!isEditing && !sessionPlan && session.coachingNotes && (
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

        {/* Session Link (resource link) */}
        {!isEditing && session.link && (
          <div className="rounded-2xl border border-[#1A1A1A] overflow-hidden">
            <div className="px-5 py-4 bg-[#111] border-b border-[#1A1A1A] flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Session Resource
              </h2>
            </div>
            <div className="p-5">
              <a
                href={session.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:bg-gold-500/20 transition-all text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Open Resource Link
              </a>
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

        {/* Client Video Upload / Display */}
        {!isEditing && (
          <div className="rounded-2xl border border-[#1A1A1A] overflow-hidden">
            <div className="px-5 py-4 bg-[#111] border-b border-[#1A1A1A] flex items-center gap-2">
              <Video className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Your Video
              </h2>
            </div>
            <div className="p-5">
              {session.videoUrlClient ? (
                <div className="space-y-3">
                  <video
                    src={session.videoUrlClient}
                    controls
                    className="w-full rounded-xl"
                    preload="metadata"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-green-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Video submitted
                    </p>
                    <a
                      href={session.videoUrlClient}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold-500 hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Full Video
                    </a>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    'relative border-2 border-dashed rounded-xl p-8 text-center transition-all',
                    isDragging
                      ? 'border-gold-500/50 bg-gold-500/5'
                      : 'border-[#2A2A2A] hover:border-gold-500/30'
                  )}
                >
                  {uploading ? (
                    <div className="space-y-3">
                      <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
                      <p className="text-sm text-gold-400">Uploading... {uploadProgress}%</p>
                      <div className="w-full max-w-xs mx-auto bg-[#1A1A1A] rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-gold-500 to-gold-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,.mp4,.mov"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVideoUpload(file);
                          e.target.value = '';
                        }}
                      />
                      <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        Drop your video here or tap to upload
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        MP4 or MOV — Max 200MB
                      </p>
                    </>
                  )}
                </div>
              )}

              {uploadError && (
                <p className="text-sm text-red-400 mt-3 flex items-center gap-1.5">
                  <X className="w-4 h-4" />
                  {uploadError}
                </p>
              )}
              {uploadSuccess && (
                <p className="text-sm text-green-400 mt-3 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  {uploadSuccess}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Legacy Completion badge (non-plan sessions) */}
        {!isEditing && !sessionPlan && allItems.length > 0 && progressPercent === 100 && (
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
