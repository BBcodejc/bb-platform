'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  User,
  Target,
  AlertCircle,
  Video,
  FileText,
  BarChart3,
  Edit3,
  X,
  Settings,
  Calendar,
  TrendingUp,
  ClipboardList,
  Shield,
  Copy,
  RefreshCw,
  Mail,
  Power,
  CheckCircle2,
  XCircle,
  Clock,
  Mic,
  Square,
  Upload,
  Play,
  Pause,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ElitePlayerDashboard, PregameCue, LimitingFactor } from '@/types/elite-player';

const COACHES = ['Coach Jake', 'Tommy', 'BB Staff'];

export default function AdminPlayerEditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bb-black flex items-center justify-center text-gray-400">Loading...</div>}>
      <AdminPlayerEditorContent />
    </Suspense>
  );
}

function AdminPlayerEditorContent() {
  const params = useParams();
  const slug = params.slug as string;
  const searchParams = useSearchParams();

  const validTabs = ['focus', 'cues', 'factors', 'videos', 'stats', 'notes', 'weekly', 'sessions', 'player', 'security'] as const;
  type TabType = typeof validTabs[number];
  const initialTab = validTabs.includes(searchParams.get('tab') as TabType) ? (searchParams.get('tab') as TabType) : 'focus';

  const [dashboard, setDashboard] = useState<ElitePlayerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedCoach, setSelectedCoach] = useState('Coach Jake');

  // Form states
  const [focusText, setFocusText] = useState('');
  const [cues, setCues] = useState<PregameCue[]>([]);
  const [factors, setFactors] = useState<LimitingFactor[]>([]);

  // Editing states
  const [editingCueId, setEditingCueId] = useState<string | null>(null);
  const [editingCueText, setEditingCueText] = useState('');
  const [editingCueCategory, setEditingCueCategory] = useState('shooting');

  const [editingFactorId, setEditingFactorId] = useState<string | null>(null);
  const [editingFactor, setEditingFactor] = useState({ name: '', description: '', cue: '', severity: 'medium', notes: '' });

  // New item forms
  const [newCue, setNewCue] = useState({ text: '', category: 'shooting' });
  const [newFactor, setNewFactor] = useState({ name: '', description: '', cue: '', severity: 'medium', notes: '' });
  const [newVideo, setNewVideo] = useState({ title: '', url: '', bbCue: '', tags: '' });
  const [newNote, setNewNote] = useState('');

  // Security state
  const [securityData, setSecurityData] = useState<{
    email: string | null;
    lastActiveAt: string | null;
    accessToken: string | null;
    isActive: boolean;
    hasActiveSession: boolean;
    loginHistory: Array<{ id: string; loginAt: string; ipAddress: string; userAgent: string }>;
  } | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [playerEmail, setPlayerEmail] = useState('');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [regeneratingToken, setRegeneratingToken] = useState(false);

  // Voice note state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceNoteTitle, setVoiceNoteTitle] = useState('');
  const [uploadingVoiceNote, setUploadingVoiceNote] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Weekly Review
  const [weeklyReview, setWeeklyReview] = useState({
    summary: '',
    whatChanged: '',
    priorities: '',
    shootingTrend: 'stable',
  });

  // Player Info
  const [playerInfo, setPlayerInfo] = useState({
    bbLevel: 2,
    bbLevelName: '',
    team: '',
    position: '',
    seasonStatus: 'in-season',
  });

  // Stats entry
  const [newGame, setNewGame] = useState({
    opponent: '',
    gameDate: new Date().toISOString().split('T')[0],
    isHome: true,
    minutes: '',
    threePointMakes: '',
    threePointAttempts: '',
    points: '',
    bbNotes: '',
    huntingNextGame: '',
  });

  useEffect(() => {
    fetchDashboard();
  }, [slug]);

  async function fetchDashboard() {
    try {
      setLoading(true);
      const res = await fetch(`/api/elite-players/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setDashboard(data);
        setFocusText(data.todaysFocus?.focusCue || '');
        setCues(data.pregameCues || data.dailyCues || []);
        setFactors(data.limitingFactors || []);

        // Set player info
        setPlayerInfo({
          bbLevel: data.player.bbLevel || 2,
          bbLevelName: data.player.bbLevelName || '',
          team: data.player.team || '',
          position: data.player.position || '',
          seasonStatus: data.player.seasonStatus || 'in-season',
        });

        // Set weekly review if exists
        if (data.weeklyReview) {
          setWeeklyReview({
            summary: data.weeklyReview.summary || '',
            whatChanged: (data.weeklyReview.whatChanged || []).join('\n'),
            priorities: (data.weeklyReview.priorities || []).join('\n'),
            shootingTrend: data.weeklyReview.shootingTrend || 'stable',
          });
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function saveAction(action: string, payload: any) {
    setSaving(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/admin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      if (res.ok) {
        await fetchDashboard();
        return true;
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
    return false;
  }

  // Security handlers
  async function fetchSecurityData() {
    setSecurityLoading(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/security`);
      if (res.ok) {
        const data = await res.json();
        setSecurityData(data);
        setPlayerEmail(data.email || '');
      }
    } catch (err) {
      console.error('Security fetch error:', err);
    } finally {
      setSecurityLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'security') {
      fetchSecurityData();
    }
  }, [activeTab]);

  async function handleCopyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  }

  async function handleRegenerateToken() {
    if (!confirm('This will invalidate the current token. The player will need the new token to log in. Continue?')) return;
    setRegeneratingToken(true);
    try {
      await fetch(`/api/elite-players/${slug}/security`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'regenerate_token' }),
      });
      await fetchSecurityData();
      await fetchDashboard();
    } finally {
      setRegeneratingToken(false);
    }
  }

  async function handleSendInvite() {
    if (!playerEmail) {
      alert('Please enter a player email first');
      return;
    }
    setSendingInvite(true);
    try {
      const res = await fetch(`/api/elite-players/${slug}/security`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_invite', email: playerEmail }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Invite email sent!');
        await fetchSecurityData();
      } else {
        alert('Failed to send: ' + (data.error || 'Unknown error'));
      }
    } finally {
      setSendingInvite(false);
    }
  }

  async function handleSaveEmail() {
    await fetch(`/api/elite-players/${slug}/security`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_email', email: playerEmail }),
    });
    await fetchSecurityData();
  }

  async function handleToggleAccess() {
    const action = securityData?.isActive ? 'revoke_access' : 'restore_access';
    const msg = securityData?.isActive
      ? 'This will deactivate the player and invalidate their session. Continue?'
      : 'This will reactivate the player. Continue?';
    if (!confirm(msg)) return;
    await fetch(`/api/elite-players/${slug}/security`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    await fetchSecurityData();
    await fetchDashboard();
  }

  function formatUserAgent(ua: string): string {
    if (!ua || ua === 'unknown') return 'Unknown';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return ua.substring(0, 40) + '...';
  }

  // Voice note handlers
  function formatVoiceDuration(seconds: number): string {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Try codecs in order of preference
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
        }
      }
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordedAudio(blob);
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);
      setRecordedAudio(null);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required to record voice notes. Please allow microphone access in your browser settings.');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
  }

  async function handleUploadVoiceNote(audioBlob: Blob, title: string) {
    if (!title.trim()) {
      alert('Please enter a title for the voice note');
      return;
    }
    setUploadingVoiceNote(true);
    try {
      const ext = audioBlob.type.includes('mp4') ? 'm4a' : audioBlob.type.includes('mpeg') ? 'mp3' : 'webm';
      const file = new File([audioBlob], `voice-note.${ext}`, { type: audioBlob.type });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', slug);
      formData.append('title', title);

      const uploadRes = await fetch('/api/upload/voice-note', { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || 'Upload failed');
      }
      const { url } = await uploadRes.json();

      // Save to DB via admin API
      await saveAction('add_voice_note', {
        title,
        url,
        duration: recordingDuration || 0,
        transcript: '',
        createdBy: selectedCoach,
      });

      // Reset state
      setVoiceNoteTitle('');
      setRecordedAudio(null);
      setRecordingDuration(0);
    } catch (err) {
      console.error('Voice note upload error:', err);
      alert('Failed to upload voice note');
    } finally {
      setUploadingVoiceNote(false);
    }
  }

  async function handleVoiceFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const title = voiceNoteTitle || file.name.replace(/\.[^/.]+$/, '');

    // Read duration from file
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      setRecordingDuration(Math.round(audio.duration));
      URL.revokeObjectURL(audio.src);
    };

    setUploadingVoiceNote(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', slug);
      formData.append('title', title);

      const uploadRes = await fetch('/api/upload/voice-note', { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || 'Upload failed');
      }
      const { url } = await uploadRes.json();

      await saveAction('add_voice_note', {
        title,
        url,
        duration: Math.round(audio.duration || 0),
        transcript: '',
        createdBy: selectedCoach,
      });

      setVoiceNoteTitle('');
      setRecordedAudio(null);
      setRecordingDuration(0);
    } catch (err) {
      console.error('Voice file upload error:', err);
      alert('Failed to upload voice note');
    } finally {
      setUploadingVoiceNote(false);
    }

    // Reset file input
    e.target.value = '';
  }

  async function handleDeleteVoiceNote(id: string) {
    if (!confirm('Delete this voice note?')) return;
    await saveAction('delete_voice_note', { id });
  }

  // Focus handlers
  async function handleSaveFocus() {
    await saveAction('update_focus', { focusCue: focusText, createdBy: selectedCoach });
  }

  // Cue handlers
  async function handleAddCue() {
    if (!newCue.text.trim()) return;
    const updatedCues = [
      ...cues,
      {
        id: `new-${Date.now()}`,
        playerId: dashboard?.player.id || '',
        cueText: newCue.text,
        category: newCue.category,
        displayOrder: cues.length,
        isActive: true,
      },
    ];
    await saveAction('update_daily_cues', {
      cues: updatedCues.map((c, i) => ({
        id: c.id.startsWith('new-') ? undefined : c.id,
        cueText: c.cueText,
        category: c.category,
        displayOrder: i,
        isActive: true,
      })),
    });
    setNewCue({ text: '', category: 'shooting' });
  }

  async function handleUpdateCue(id: string) {
    const updatedCues = cues.map(c =>
      c.id === id ? { ...c, cueText: editingCueText, category: editingCueCategory } : c
    );
    await saveAction('update_daily_cues', {
      cues: updatedCues.map((c, i) => ({
        id: c.id,
        cueText: c.cueText,
        category: c.category,
        displayOrder: i,
        isActive: true,
      })),
    });
    setEditingCueId(null);
  }

  async function handleDeleteCue(id: string) {
    const updatedCues = cues.filter(c => c.id !== id);
    await saveAction('update_daily_cues', {
      cues: updatedCues.map((c, i) => ({
        id: c.id,
        cueText: c.cueText,
        category: c.category,
        displayOrder: i,
        isActive: true,
      })),
    });
  }

  function startEditingCue(cue: PregameCue) {
    setEditingCueId(cue.id);
    setEditingCueText(cue.cueText);
    setEditingCueCategory(cue.category);
  }

  // Factor handlers
  async function handleAddFactor() {
    if (!newFactor.name.trim()) return;
    await saveAction('add_limiting_factor', {
      name: newFactor.name,
      shortDescription: newFactor.description,
      awarenesssCue: newFactor.cue,
      severity: newFactor.severity,
      notes: newFactor.notes,
    });
    setNewFactor({ name: '', description: '', cue: '', severity: 'medium', notes: '' });
  }

  async function handleUpdateFactor(id: string) {
    await saveAction('update_limiting_factor', {
      id,
      name: editingFactor.name,
      shortDescription: editingFactor.description,
      awarenesssCue: editingFactor.cue,
      severity: editingFactor.severity,
      notes: editingFactor.notes,
    });
    setEditingFactorId(null);
  }

  async function handleDeleteFactor(id: string) {
    await saveAction('update_limiting_factor', { id, isActive: false });
  }

  function startEditingFactor(factor: LimitingFactor) {
    setEditingFactorId(factor.id);
    setEditingFactor({
      name: factor.name,
      description: factor.shortDescription || '',
      cue: factor.awarenesssCue || '',
      severity: factor.severity || factor.priority || 'medium',
      notes: factor.notes || '',
    });
  }

  // Video handlers
  async function handleAddVideo() {
    if (!newVideo.title.trim() || !newVideo.url.trim()) return;
    await saveAction('add_video', {
      title: newVideo.title,
      url: newVideo.url,
      bbCue: newVideo.bbCue,
      tags: newVideo.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setNewVideo({ title: '', url: '', bbCue: '', tags: '' });
  }

  async function handleDeleteVideo(id: string) {
    await saveAction('delete_video', { id });
  }

  // Note handlers
  async function handleAddNote() {
    if (!newNote.trim()) return;
    await saveAction('add_coach_note', {
      text: newNote,
      createdBy: selectedCoach,
    });
    setNewNote('');
  }

  // Game handlers
  async function handleAddGame() {
    if (!newGame.opponent.trim() || !newGame.threePointAttempts) return;
    await saveAction('add_game_report', {
      opponent: newGame.opponent,
      gameDate: newGame.gameDate,
      isHome: newGame.isHome,
      minutesPlayed: parseInt(newGame.minutes) || undefined,
      threePointMakes: parseInt(newGame.threePointMakes) || 0,
      threePointAttempts: parseInt(newGame.threePointAttempts) || 0,
      points: parseInt(newGame.points) || undefined,
      bbNotes: newGame.bbNotes,
      huntingNextGame: newGame.huntingNextGame,
    });
    setNewGame({
      opponent: '',
      gameDate: new Date().toISOString().split('T')[0],
      isHome: true,
      minutes: '',
      threePointMakes: '',
      threePointAttempts: '',
      points: '',
      bbNotes: '',
      huntingNextGame: '',
    });
  }

  // Weekly Review handlers
  async function handleSaveWeeklyReview() {
    await saveAction('update_weekly_review', {
      summary: weeklyReview.summary,
      whatChanged: weeklyReview.whatChanged.split('\n').filter(Boolean),
      priorities: weeklyReview.priorities.split('\n').filter(Boolean),
      shootingTrend: weeklyReview.shootingTrend,
      createdBy: selectedCoach,
    });
  }

  // Player Info handlers
  async function handleSavePlayerInfo() {
    await saveAction('update_player', {
      bbLevel: playerInfo.bbLevel,
      bbLevelName: playerInfo.bbLevelName,
      team: playerInfo.team,
      position: playerInfo.position,
      seasonStatus: playerInfo.seasonStatus,
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-bb-black flex items-center justify-center">
        <p className="text-gray-400">Player not found</p>
      </div>
    );
  }

  const { player } = dashboard;

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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    {player.firstName} {player.lastName}
                  </h1>
                  <p className="text-sm text-gray-400">{player.team}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Coach Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Editing as:</span>
                <select
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-bb-dark border border-bb-border text-white text-sm"
                >
                  {COACHES.map(coach => (
                    <option key={coach} value={coach}>{coach}</option>
                  ))}
                </select>
              </div>
              <Link href={`/admin/players/${slug}/dashboard`}>
                <Button variant="ghost" size="sm" className="text-gold-500 hover:text-gold-400">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  2K Dashboard
                </Button>
              </Link>
              <Link href={`/players/${slug}`} target="_blank">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Public View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-bb-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'focus', label: "Today's Focus", icon: Target },
              { id: 'cues', label: 'Pre-Game Cues', icon: Target },
              { id: 'factors', label: 'Limiting Factors', icon: AlertCircle },
              { id: 'weekly', label: 'Weekly Review', icon: TrendingUp },
              { id: 'videos', label: 'Videos', icon: Video },
              { id: 'stats', label: 'Game Stats', icon: BarChart3 },
              { id: 'notes', label: 'Coach Notes', icon: FileText },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'player', label: 'Player Info', icon: Settings },
              { id: 'security', label: 'Security', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-gold-500 text-gold-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* TODAY'S FOCUS */}
        {activeTab === 'focus' && (
          <Card>
            <CardHeader>
              <CardTitle>Today's Focus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={focusText}
                onChange={(e) => setFocusText(e.target.value)}
                placeholder="Enter today's focus cue..."
                rows={3}
                className="bg-bb-dark/50"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Will be saved as: {selectedCoach}</p>
                <Button onClick={handleSaveFocus} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Focus'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PRE-GAME CUES */}
        {activeTab === 'cues' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Cue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      value={newCue.text}
                      onChange={(e) => setNewCue({ ...newCue, text: e.target.value })}
                      placeholder="Cue text..."
                      className="bg-bb-dark/50"
                    />
                  </div>
                  <select
                    value={newCue.category}
                    onChange={(e) => setNewCue({ ...newCue, category: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-bb-dark/50 border border-bb-border text-white"
                  >
                    <option value="shooting">Shooting</option>
                    <option value="decision">Decision</option>
                    <option value="mindset">Mindset</option>
                    <option value="movement">Movement</option>
                    <option value="defense">Defense</option>
                    <option value="rebounding">Rebounding</option>
                    <option value="handle">Handle</option>
                    <option value="finishing">Finishing</option>
                  </select>
                </div>
                <Button onClick={handleAddCue} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Cue
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Cues ({cues.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cues.map((cue, i) => (
                    <div
                      key={cue.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-bb-dark/50 border border-bb-border"
                    >
                      <GripVertical className="w-4 h-4 text-gray-600" />
                      <span className="text-gold-500 font-bold">{i + 1}</span>

                      {editingCueId === cue.id ? (
                        <>
                          <Input
                            value={editingCueText}
                            onChange={(e) => setEditingCueText(e.target.value)}
                            className="flex-1 bg-bb-dark"
                          />
                          <select
                            value={editingCueCategory}
                            onChange={(e) => setEditingCueCategory(e.target.value)}
                            className="px-2 py-1 rounded bg-bb-dark border border-bb-border text-white text-sm"
                          >
                            <option value="shooting">Shooting</option>
                            <option value="decision">Decision</option>
                            <option value="mindset">Mindset</option>
                            <option value="movement">Movement</option>
                            <option value="defense">Defense</option>
                            <option value="rebounding">Rebounding</option>
                            <option value="handle">Handle</option>
                            <option value="finishing">Finishing</option>
                          </select>
                          <button onClick={() => handleUpdateCue(cue.id)} className="p-1 hover:bg-green-500/20 rounded">
                            <Save className="w-4 h-4 text-green-400" />
                          </button>
                          <button onClick={() => setEditingCueId(null)} className="p-1 hover:bg-gray-500/20 rounded">
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-white">{cue.cueText}</span>
                          <span className="text-xs text-gray-500 capitalize px-2 py-1 bg-bb-dark rounded">{cue.category}</span>
                          <button onClick={() => startEditingCue(cue)} className="p-1 hover:bg-blue-500/20 rounded">
                            <Edit3 className="w-4 h-4 text-blue-400" />
                          </button>
                          <button onClick={() => handleDeleteCue(cue.id)} className="p-1 hover:bg-red-500/20 rounded">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {cues.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No cues added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* LIMITING FACTORS */}
        {activeTab === 'factors' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Limiting Factor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={newFactor.name}
                  onChange={(e) => setNewFactor({ ...newFactor, name: e.target.value })}
                  placeholder="Factor name..."
                  className="bg-bb-dark/50"
                />
                <Textarea
                  value={newFactor.description}
                  onChange={(e) => setNewFactor({ ...newFactor, description: e.target.value })}
                  placeholder="Short description..."
                  rows={2}
                  className="bg-bb-dark/50"
                />
                <Textarea
                  value={newFactor.cue}
                  onChange={(e) => setNewFactor({ ...newFactor, cue: e.target.value })}
                  placeholder="Awareness cue (what player should think about)..."
                  rows={2}
                  className="bg-bb-dark/50"
                />
                <Textarea
                  value={newFactor.notes}
                  onChange={(e) => setNewFactor({ ...newFactor, notes: e.target.value })}
                  placeholder="Additional notes (internal)..."
                  rows={2}
                  className="bg-bb-dark/50"
                />
                <select
                  value={newFactor.severity}
                  onChange={(e) => setNewFactor({ ...newFactor, severity: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-bb-dark/50 border border-bb-border text-white"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <Button onClick={handleAddFactor} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Factor
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Factors ({factors.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {factors.map((factor) => (
                    <div key={factor.id} className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border">
                      {editingFactorId === factor.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editingFactor.name}
                            onChange={(e) => setEditingFactor({ ...editingFactor, name: e.target.value })}
                            placeholder="Factor name..."
                            className="bg-bb-dark"
                          />
                          <Textarea
                            value={editingFactor.description}
                            onChange={(e) => setEditingFactor({ ...editingFactor, description: e.target.value })}
                            placeholder="Description..."
                            rows={2}
                            className="bg-bb-dark"
                          />
                          <Textarea
                            value={editingFactor.cue}
                            onChange={(e) => setEditingFactor({ ...editingFactor, cue: e.target.value })}
                            placeholder="Awareness cue..."
                            rows={2}
                            className="bg-bb-dark"
                          />
                          <Textarea
                            value={editingFactor.notes}
                            onChange={(e) => setEditingFactor({ ...editingFactor, notes: e.target.value })}
                            placeholder="Notes..."
                            rows={2}
                            className="bg-bb-dark"
                          />
                          <select
                            value={editingFactor.severity}
                            onChange={(e) => setEditingFactor({ ...editingFactor, severity: e.target.value })}
                            className="px-3 py-2 rounded-lg bg-bb-dark border border-bb-border text-white"
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                          <div className="flex gap-2">
                            <Button onClick={() => handleUpdateFactor(factor.id)} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-1" /> Save
                            </Button>
                            <Button onClick={() => setEditingFactorId(null)} variant="ghost" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-white">{factor.name}</h4>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                'px-2 py-0.5 text-xs rounded uppercase',
                                factor.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                factor.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              )}>
                                {factor.priority}
                              </span>
                              <button onClick={() => startEditingFactor(factor)} className="p-1 hover:bg-blue-500/20 rounded">
                                <Edit3 className="w-4 h-4 text-blue-400" />
                              </button>
                              <button onClick={() => handleDeleteFactor(factor.id)} className="p-1 hover:bg-red-500/20 rounded">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                          {factor.shortDescription && (
                            <p className="text-sm text-gray-400 mt-1">{factor.shortDescription}</p>
                          )}
                          {factor.awarenesssCue && (
                            <p className="text-sm text-gold-400 mt-2">
                              <span className="font-medium">Cue:</span> {factor.awarenesssCue}
                            </p>
                          )}
                          {factor.notes && (
                            <p className="text-xs text-gray-500 mt-2 italic">Notes: {factor.notes}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  {factors.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No limiting factors added</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* WEEKLY REVIEW */}
        {activeTab === 'weekly' && (
          <Card>
            <CardHeader>
              <CardTitle>Weekly Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Shooting Trend</label>
                <select
                  value={weeklyReview.shootingTrend}
                  onChange={(e) => setWeeklyReview({ ...weeklyReview, shootingTrend: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-bb-dark/50 border border-bb-border text-white w-full md:w-auto"
                >
                  <option value="improving">Improving ↑</option>
                  <option value="stable">Stable →</option>
                  <option value="declining">Declining ↓</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Summary</label>
                <Textarea
                  value={weeklyReview.summary}
                  onChange={(e) => setWeeklyReview({ ...weeklyReview, summary: e.target.value })}
                  placeholder="Overall summary of the week..."
                  rows={3}
                  className="bg-bb-dark/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">What Changed (one per line)</label>
                <Textarea
                  value={weeklyReview.whatChanged}
                  onChange={(e) => setWeeklyReview({ ...weeklyReview, whatChanged: e.target.value })}
                  placeholder="3PT% improved from 34% to 38%&#10;Better back-rim control&#10;Reduced directional misses"
                  rows={4}
                  className="bg-bb-dark/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Priorities This Week (one per line)</label>
                <Textarea
                  value={weeklyReview.priorities}
                  onChange={(e) => setWeeklyReview({ ...weeklyReview, priorities: e.target.value })}
                  placeholder="Continue back-rim emphasis&#10;Work on off-dribble pull-ups&#10;Stay patient on early doubles"
                  rows={4}
                  className="bg-bb-dark/50"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Will be saved as: {selectedCoach}</p>
                <Button onClick={handleSaveWeeklyReview} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Weekly Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* VIDEOS */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="Video title..."
                  className="bg-bb-dark/50"
                />
                <Input
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  placeholder="Video URL (YouTube, Drive, etc.)..."
                  className="bg-bb-dark/50"
                />
                <Input
                  value={newVideo.bbCue}
                  onChange={(e) => setNewVideo({ ...newVideo, bbCue: e.target.value })}
                  placeholder="BB Cue for this video..."
                  className="bg-bb-dark/50"
                />
                <Input
                  value={newVideo.tags}
                  onChange={(e) => setNewVideo({ ...newVideo, tags: e.target.value })}
                  placeholder="Tags (comma-separated): catch-and-shoot, training, etc."
                  className="bg-bb-dark/50"
                />
                <Button onClick={handleAddVideo} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Library ({dashboard.videoLibrary.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboard.videoLibrary.map((video) => (
                    <div key={video.id} className="flex items-center gap-3 p-3 rounded-lg bg-bb-dark/50 border border-bb-border">
                      <Video className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{video.title}</p>
                        {video.bbCue && <p className="text-xs text-gray-500">{video.bbCue}</p>}
                        {video.tags && video.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {video.tags.map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-bb-dark rounded text-gray-400">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline text-sm">
                        View
                      </a>
                      <button onClick={() => handleDeleteVideo(video.id)} className="p-1 hover:bg-red-500/20 rounded">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                  {dashboard.videoLibrary.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No videos added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* GAME STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Game Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input
                    value={newGame.opponent}
                    onChange={(e) => setNewGame({ ...newGame, opponent: e.target.value })}
                    placeholder="Opponent"
                    className="bg-bb-dark/50"
                  />
                  <Input
                    type="date"
                    value={newGame.gameDate}
                    onChange={(e) => setNewGame({ ...newGame, gameDate: e.target.value })}
                    className="bg-bb-dark/50"
                  />
                  <select
                    value={newGame.isHome ? 'home' : 'away'}
                    onChange={(e) => setNewGame({ ...newGame, isHome: e.target.value === 'home' })}
                    className="px-3 py-2 rounded-lg bg-bb-dark/50 border border-bb-border text-white"
                  >
                    <option value="home">Home</option>
                    <option value="away">Away</option>
                  </select>
                  <Input
                    value={newGame.minutes}
                    onChange={(e) => setNewGame({ ...newGame, minutes: e.target.value })}
                    placeholder="Minutes"
                    type="number"
                    className="bg-bb-dark/50"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    value={newGame.threePointMakes}
                    onChange={(e) => setNewGame({ ...newGame, threePointMakes: e.target.value })}
                    placeholder="3PM"
                    type="number"
                    className="bg-bb-dark/50"
                  />
                  <Input
                    value={newGame.threePointAttempts}
                    onChange={(e) => setNewGame({ ...newGame, threePointAttempts: e.target.value })}
                    placeholder="3PA"
                    type="number"
                    className="bg-bb-dark/50"
                  />
                  <Input
                    value={newGame.points}
                    onChange={(e) => setNewGame({ ...newGame, points: e.target.value })}
                    placeholder="Points"
                    type="number"
                    className="bg-bb-dark/50"
                  />
                </div>
                <Textarea
                  value={newGame.bbNotes}
                  onChange={(e) => setNewGame({ ...newGame, bbNotes: e.target.value })}
                  placeholder="BB Notes..."
                  rows={2}
                  className="bg-bb-dark/50"
                />
                <Textarea
                  value={newGame.huntingNextGame}
                  onChange={(e) => setNewGame({ ...newGame, huntingNextGame: e.target.value })}
                  placeholder="What to hunt next game..."
                  rows={2}
                  className="bg-bb-dark/50"
                />
                <Button onClick={handleAddGame} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Game
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Games ({dashboard.recentGames.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboard.recentGames.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-3 rounded-lg bg-bb-dark/50 border border-bb-border">
                      <div>
                        <p className="text-white font-medium">
                          {game.isHome ? 'vs' : '@'} {game.opponent}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(game.gameDate).toLocaleDateString()}
                          {game.minutesPlayed && ` · ${game.minutesPlayed} min`}
                        </p>
                        {game.bbNotes && <p className="text-xs text-gray-400 mt-1">{game.bbNotes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {game.threePointMakes}/{game.threePointAttempts}
                        </p>
                        <p className="text-xs text-gray-500">
                          {game.threePointPercentage?.toFixed(0) || '-'}% 3PT
                          {game.points && ` · ${game.points} pts`}
                        </p>
                      </div>
                    </div>
                  ))}
                  {dashboard.recentGames.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No games tracked yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* COACH NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Coach Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a note..."
                  rows={4}
                  className="bg-bb-dark/50"
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Will be saved as: {selectedCoach}</p>
                  <Button onClick={handleAddNote} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notes ({dashboard.coachNotes?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(dashboard.coachNotes || []).map((note) => (
                    <div key={note.id} className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border">
                      <p className="text-gray-300">{note.text}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {note.createdBy && <span className="text-gold-500">{note.createdBy}</span>}
                        {note.createdBy && ' · '}
                        {new Date(note.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {(!dashboard.coachNotes || dashboard.coachNotes.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No notes added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* VOICE NOTES */}
            <Card className="bg-bb-card border-bb-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-green-400" />
                  Voice Notes ({dashboard.voiceNotes?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title Input */}
                <Input
                  value={voiceNoteTitle}
                  onChange={(e) => setVoiceNoteTitle(e.target.value)}
                  placeholder="Voice note title..."
                  className="bg-bb-dark/50"
                />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      variant="outline"
                      size="sm"
                      className="border-bb-border text-gray-300 hover:text-white hover:border-green-500"
                      disabled={uploadingVoiceNote}
                    >
                      <Mic className="w-4 h-4 mr-2 text-green-400" />
                      Record
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <span className="w-2 h-2 bg-red-300 rounded-full animate-pulse mr-2" />
                      <Square className="w-3.5 h-3.5 mr-2" />
                      Stop ({formatVoiceDuration(recordingDuration)})
                    </Button>
                  )}

                  <input
                    id="voice-note-file-input"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleVoiceFileUpload}
                    disabled={uploadingVoiceNote || isRecording}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-bb-border text-gray-300 hover:text-white cursor-pointer"
                    disabled={uploadingVoiceNote || isRecording}
                    onClick={() => document.getElementById('voice-note-file-input')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>

                {/* Recorded Audio Preview */}
                {recordedAudio && !isRecording && (
                  <div className="p-4 rounded-lg bg-bb-dark/50 border border-bb-border space-y-3">
                    <audio
                      src={URL.createObjectURL(recordedAudio)}
                      controls
                      className="w-full h-10"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatVoiceDuration(recordingDuration)} recorded
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setRecordedAudio(null); setRecordingDuration(0); }}
                          className="border-bb-border text-gray-400"
                        >
                          Discard
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUploadVoiceNote(recordedAudio, voiceNoteTitle || 'Voice Note')}
                          disabled={uploadingVoiceNote}
                          className="bg-gold-500 hover:bg-gold-600 text-black"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {uploadingVoiceNote ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {uploadingVoiceNote && !recordedAudio && (
                  <p className="text-gold-500 text-sm animate-pulse">Uploading voice note...</p>
                )}

                {/* Existing Voice Notes List */}
                {(dashboard.voiceNotes && dashboard.voiceNotes.length > 0) && (
                  <div className="space-y-2 pt-4 border-t border-bb-border">
                    {dashboard.voiceNotes.map((note) => (
                      <div key={note.id} className="flex items-center gap-3 p-3 rounded-lg bg-bb-dark/50 border border-bb-border">
                        <audio src={note.url} controls className="flex-1 h-8" style={{ minWidth: 0 }} />
                        <div className="min-w-0 flex-shrink-0">
                          <p className="text-sm text-white truncate max-w-[140px]">{note.title}</p>
                          <p className="text-xs text-gray-500">
                            {note.createdBy}
                            {note.duration ? ` · ${formatVoiceDuration(note.duration)}` : ''}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteVoiceNote(note.id)}
                          className="text-red-400 hover:text-red-300 p-1 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {(!dashboard.voiceNotes || dashboard.voiceNotes.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-2">No voice notes yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* SESSIONS */}
        {activeTab === 'sessions' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Training Sessions</CardTitle>
                <Link href={`/admin/players/${slug}/sessions`}>
                  <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-black">
                    <Calendar className="w-4 h-4 mr-2" />
                    Open Calendar View
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                View and manage all training sessions, pre-game routines, and evaluations in the full calendar view.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link
                  href={`/admin/players/${slug}/sessions`}
                  className="p-4 rounded-xl bg-bb-dark/50 border border-bb-border hover:border-gold-500/30 transition-colors text-center"
                >
                  <Calendar className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">Calendar</p>
                  <p className="text-xs text-gray-500">Monthly view</p>
                </Link>
                <Link
                  href={`/elite/${slug}/pregame`}
                  target="_blank"
                  className="p-4 rounded-xl bg-bb-dark/50 border border-bb-border hover:border-gold-500/30 transition-colors text-center"
                >
                  <Target className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">Pre-Game</p>
                  <p className="text-xs text-gray-500">Today's routine</p>
                </Link>
                <Link
                  href={`/admin/players/${slug}/postgame`}
                  className="p-4 rounded-xl bg-bb-dark/50 border border-bb-border hover:border-amber-500/30 transition-colors text-center"
                >
                  <ClipboardList className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">Post-Game</p>
                  <p className="text-xs text-gray-500">Shot analysis</p>
                </Link>
                <Link
                  href={`/elite/${slug}`}
                  target="_blank"
                  className="p-4 rounded-xl bg-bb-dark/50 border border-bb-border hover:border-gold-500/30 transition-colors text-center"
                >
                  <ExternalLink className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white">Profile</p>
                  <p className="text-xs text-gray-500">Player view</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PLAYER INFO */}
        {activeTab === 'player' && (
          <Card>
            <CardHeader>
              <CardTitle>Player Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">BB Level</label>
                  <select
                    value={playerInfo.bbLevel}
                    onChange={(e) => setPlayerInfo({ ...playerInfo, bbLevel: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-bb-dark/50 border border-bb-border text-white"
                  >
                    <option value={1}>BB 1 - Foundation</option>
                    <option value={2}>BB 2 - Calibrated</option>
                    <option value={3}>BB 3 - Adaptive</option>
                    <option value={4}>BB 4 - Master</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">BB Level Display Name</label>
                  <Input
                    value={playerInfo.bbLevelName}
                    onChange={(e) => setPlayerInfo({ ...playerInfo, bbLevelName: e.target.value })}
                    placeholder="e.g., BB 2 - Calibrated"
                    className="bg-bb-dark/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Team</label>
                  <Input
                    value={playerInfo.team}
                    onChange={(e) => setPlayerInfo({ ...playerInfo, team: e.target.value })}
                    placeholder="Team name..."
                    className="bg-bb-dark/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Position</label>
                  <Input
                    value={playerInfo.position}
                    onChange={(e) => setPlayerInfo({ ...playerInfo, position: e.target.value })}
                    placeholder="Position..."
                    className="bg-bb-dark/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Season Status</label>
                <select
                  value={playerInfo.seasonStatus}
                  onChange={(e) => setPlayerInfo({ ...playerInfo, seasonStatus: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-bb-dark/50 border border-bb-border text-white"
                >
                  <option value="in-season">In-Season</option>
                  <option value="off-season">Off-Season</option>
                  <option value="playoffs">Playoffs</option>
                  <option value="pre-season">Pre-Season</option>
                </select>
              </div>
              <Button onClick={handleSavePlayerInfo} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Player Info'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ==================== SECURITY TAB ==================== */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {securityLoading ? (
              <div className="text-center py-12 text-gray-400">Loading security data...</div>
            ) : securityData ? (
              <>
                {/* Credentials Card */}
                <Card className="bg-bb-card border-bb-border">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-gold-500" />
                      Credentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Access Token */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Access Token</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-bb-dark/50 border border-bb-border rounded-lg text-gold-500 font-mono text-sm">
                          {securityData.accessToken || 'No token set'}
                        </code>
                        {securityData.accessToken && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyToClipboard(securityData.accessToken!, 'token')}
                            className="border-bb-border text-gray-300 hover:text-white"
                          >
                            {copyFeedback === 'token' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Player Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Player Email</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={playerEmail}
                          onChange={(e) => setPlayerEmail(e.target.value)}
                          placeholder="player@email.com"
                          className="bg-bb-dark/50 flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSaveEmail}
                          className="border-bb-border text-gray-300 hover:text-white"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Direct Login URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Direct Login URL</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-bb-dark/50 border border-bb-border rounded-lg text-gray-300 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {`https://bb-platform-virid.vercel.app/elite/${slug}?token=${securityData.accessToken || ''}`}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyToClipboard(
                            `https://bb-platform-virid.vercel.app/elite/${slug}?token=${securityData.accessToken || ''}`,
                            'url'
                          )}
                          className="border-bb-border text-gray-300 hover:text-white"
                        >
                          {copyFeedback === 'url' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions Card */}
                <Card className="bg-bb-card border-bb-border">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gold-500" />
                      Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleRegenerateToken}
                        disabled={regeneratingToken}
                        variant="outline"
                        className="border-bb-border text-gray-300 hover:text-white hover:border-gold-500"
                      >
                        <RefreshCw className={cn("w-4 h-4 mr-2", regeneratingToken && "animate-spin")} />
                        {regeneratingToken ? 'Regenerating...' : 'Regenerate Token'}
                      </Button>
                      <Button
                        onClick={handleSendInvite}
                        disabled={sendingInvite || !playerEmail}
                        variant="outline"
                        className="border-bb-border text-gray-300 hover:text-white hover:border-gold-500"
                      >
                        <Mail className={cn("w-4 h-4 mr-2", sendingInvite && "animate-pulse")} />
                        {sendingInvite ? 'Sending...' : 'Send Invite Email'}
                      </Button>
                    </div>
                    {!playerEmail && (
                      <p className="text-xs text-gray-500">Add a player email above to enable invite sending.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Status Card */}
                <Card className="bg-bb-card border-bb-border">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-gold-500" />
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Account Status */}
                      <div className="bg-bb-dark/50 rounded-lg p-4 border border-bb-border">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account</div>
                        <div className="flex items-center gap-2">
                          {securityData.isActive ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-green-400 font-medium">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-400 font-medium">Inactive</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Last Active */}
                      <div className="bg-bb-dark/50 rounded-lg p-4 border border-bb-border">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Active</div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {securityData.lastActiveAt
                              ? new Date(securityData.lastActiveAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })
                              : 'Never'}
                          </span>
                        </div>
                      </div>

                      {/* Session */}
                      <div className="bg-bb-dark/50 rounded-lg p-4 border border-bb-border">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Session</div>
                        <div className="flex items-center gap-2">
                          {securityData.hasActiveSession ? (
                            <>
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-green-400 text-sm">Active Session</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 rounded-full bg-gray-600" />
                              <span className="text-gray-500 text-sm">No Active Session</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleToggleAccess}
                      variant="outline"
                      className={cn(
                        "border-bb-border",
                        securityData.isActive
                          ? "text-red-400 hover:text-red-300 hover:border-red-500"
                          : "text-green-400 hover:text-green-300 hover:border-green-500"
                      )}
                    >
                      <Power className="w-4 h-4 mr-2" />
                      {securityData.isActive ? 'Revoke Access' : 'Restore Access'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Login History */}
                <Card className="bg-bb-card border-bb-border">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gold-500" />
                      Login History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {securityData.loginHistory.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No login history yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-bb-border text-gray-400 text-left">
                              <th className="pb-2 pr-4">Date</th>
                              <th className="pb-2 pr-4">IP Address</th>
                              <th className="pb-2">Browser</th>
                            </tr>
                          </thead>
                          <tbody>
                            {securityData.loginHistory.map((entry) => (
                              <tr key={entry.id} className="border-b border-bb-border/50">
                                <td className="py-2 pr-4 text-gray-300">
                                  {new Date(entry.loginAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                  })}
                                </td>
                                <td className="py-2 pr-4 text-gray-400 font-mono text-xs">
                                  {entry.ipAddress || 'Unknown'}
                                </td>
                                <td className="py-2 text-gray-400">
                                  {formatUserAgent(entry.userAgent)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">Failed to load security data.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
