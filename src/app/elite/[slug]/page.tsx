'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Target,
  AlertTriangle,
  Play,
  Mic,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Video,
  Loader2,
  Shield,
  Lock,
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
  EliteLimitingFactor,
  EliteCoachNote,
} from '@/types/elite-profile';

// ============================================
// ELITE PROFILE PAGE
// Private NBA war room interface
// Admin/Coach editable only
// ============================================

const COACHES = ['Coach Jake', 'Coach Tommy'];

export default function EliteProfilePage() {
  const params = useParams();
  const router = useRouter();
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

  // Section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cues: true,
    limitingFactors: true,
    protocol: false,
    weeklyReview: true,
    notes: true,
    videos: false,
  });

  // Editing states
  const [editingCues, setEditingCues] = useState<ElitePregameCue[]>([]);
  const [editingFactors, setEditingFactors] = useState<EliteLimitingFactor[]>([]);
  const [newNote, setNewNote] = useState('');

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      const result = await getCurrentUser();
      if (result.isAuthenticated && result.user) {
        setUser(result.user);
        setCanEdit(canEditElite(result.user.role));
      }
      setAuthLoading(false);
    }
    checkAuth();
  }, []);

  // Fetch elite profile data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/elite/${slug}`);
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setDashboard(data);
        setEditingCues(data.pregameCues || []);
        setEditingFactors(data.limitingFactors || []);
      } catch (err) {
        setError('Unable to load elite profile');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  // Logout handler
  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Toggle section
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Save changes
  const handleSave = async (section: string, data: any) => {
    if (!canEdit) return;
    setSaving(true);
    try {
      await fetch(`/api/elite/${slug}/admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: section, data, coach: selectedCoach }),
      });
      // Refresh data
      const res = await fetch(`/api/elite/${slug}`);
      const updated = await res.json();
      setDashboard(updated);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Add coach note
  const addCoachNote = async () => {
    if (!newNote.trim() || !canEdit) return;
    await handleSave('add_note', { text: newNote });
    setNewNote('');
  };

  // Loading states
  if (authLoading || loading) {
    return (
      <EliteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-gold-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading elite profile...</p>
          </div>
        </div>
      </EliteLayout>
    );
  }

  // Error state
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

  const { player, pregameCues, limitingFactors, gameDayProtocol, weeklyReview, coachNotes, voiceNotes, videoClips } = dashboard;

  return (
    <EliteLayout user={user} isEditing={isEditing} onLogout={handleLogout}>
      {/* Hero Section - Cinematic */}
      <div className="relative bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D] border-b border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-8">
            {/* Player Image */}
            <div className="relative">
              {player.headshotUrl ? (
                <img
                  src={player.headshotUrl}
                  alt={player.name}
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-gold-500/30"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 border-2 border-gold-500/30 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gold-500">
                    {player.firstName?.[0]}{player.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                {player.name}
              </h1>
              <p className="text-xl text-gray-400 mt-1">
                {player.position} • {player.team}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="px-3 py-1 bg-gold-500/20 text-gold-500 text-sm font-medium rounded-full">
                  {player.seasonStatus.replace('-', ' ').toUpperCase()}
                </span>
              </div>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pre-Game Cues */}
            <Card className="bg-[#0D0D0D] border-[#1A1A1A]">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleSection('cues')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gold-500/20">
                      <Target className="w-5 h-5 text-gold-500" />
                    </div>
                    <CardTitle className="text-lg text-white">Pre-Game Cues</CardTitle>
                  </div>
                  {openSections.cues ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>

              {openSections.cues && (
                <CardContent className="pt-0 space-y-3">
                  {pregameCues.map((cue, i) => (
                    <div
                      key={cue.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{cue.text}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                          {cue.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* Limiting Factors */}
            <Card className="bg-[#0D0D0D] border-[#1A1A1A]">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleSection('limitingFactors')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <CardTitle className="text-lg text-white">Limiting Factors</CardTitle>
                  </div>
                  {openSections.limitingFactors ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>

              {openSections.limitingFactors && (
                <CardContent className="pt-0 space-y-4">
                  {limitingFactors.map((factor) => (
                    <div
                      key={factor.id}
                      className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold">{factor.name}</h4>
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded',
                          factor.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                          factor.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        )}>
                          {factor.severity}
                        </span>
                      </div>
                      {factor.shortDescription && (
                        <p className="text-gray-400 text-sm mb-3">{factor.shortDescription}</p>
                      )}
                      {factor.awarenessCue && (
                        <div className="p-3 rounded-lg bg-[#0D0D0D] border border-gold-500/20">
                          <p className="text-gold-500 text-sm font-medium">
                            {factor.awarenessCue}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* Weekly Review */}
            {weeklyReview && (
              <Card className="bg-[#0D0D0D] border-[#1A1A1A]">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleSection('weeklyReview')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <CardTitle className="text-lg text-white">Weekly Review</CardTitle>
                    </div>
                    {openSections.weeklyReview ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>

                {openSections.weeklyReview && (
                  <CardContent className="pt-0">
                    <p className="text-gray-300 mb-4">{weeklyReview.summary}</p>

                    {weeklyReview.whatChanged.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-xs text-gray-500 uppercase tracking-wide mb-2">What Changed</h5>
                        <ul className="space-y-1">
                          {weeklyReview.whatChanged.map((item, i) => (
                            <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                              <span className="text-gold-500 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {weeklyReview.priorities.length > 0 && (
                      <div>
                        <h5 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Priorities</h5>
                        <ul className="space-y-1">
                          {weeklyReview.priorities.map((item, i) => (
                            <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                              <span className="text-blue-400 mt-1">{i + 1}.</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Coach Notes */}
            <Card className="bg-[#0D0D0D] border-[#1A1A1A]">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleSection('notes')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <CardTitle className="text-base text-white">Coach Notes</CardTitle>
                  </div>
                  {openSections.notes ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>

              {openSections.notes && (
                <CardContent className="pt-0 space-y-3">
                  {/* Add Note (Admin/Coach only) */}
                  {canEdit && isEditing && (
                    <div className="mb-4">
                      <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note..."
                        className="bg-[#1A1A1A] border-[#2A2A2A] text-white mb-2"
                        rows={3}
                      />
                      <Button
                        onClick={addCoachNote}
                        disabled={!newNote.trim() || saving}
                        size="sm"
                        className="bg-gold-500 text-black"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Note
                      </Button>
                    </div>
                  )}

                  {coachNotes.slice(0, 5).map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A]"
                    >
                      <p className="text-gray-300 text-sm">{note.text}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{note.createdBy}</span>
                        <span>•</span>
                        <span>{new Date(note.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* Voice Notes */}
            {voiceNotes.length > 0 && (
              <Card className="bg-[#0D0D0D] border-[#1A1A1A]">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Mic className="w-5 h-5 text-green-400" />
                    </div>
                    <CardTitle className="text-base text-white">Voice Notes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {voiceNotes.map((note) => (
                    <button
                      key={note.id}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] hover:border-green-500/30 transition-colors text-left"
                    >
                      <Play className="w-4 h-4 text-green-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{note.title}</p>
                        <p className="text-gray-500 text-xs">{note.createdBy}</p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Video Clips */}
            {videoClips.length > 0 && (
              <Card className="bg-[#0D0D0D] border-[#1A1A1A]">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleSection('videos')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/20">
                        <Video className="w-5 h-5 text-red-400" />
                      </div>
                      <CardTitle className="text-base text-white">Video Library</CardTitle>
                    </div>
                    {openSections.videos ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>

                {openSections.videos && (
                  <CardContent className="pt-0 space-y-2">
                    {videoClips.slice(0, 5).map((clip) => (
                      <a
                        key={clip.id}
                        href={clip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] hover:border-red-500/30 transition-colors"
                      >
                        <div className="w-12 h-8 rounded bg-[#2A2A2A] flex items-center justify-center">
                          <Play className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{clip.title}</p>
                          <p className="text-gray-500 text-xs">{clip.category}</p>
                        </div>
                      </a>
                    ))}
                  </CardContent>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </EliteLayout>
  );
}
