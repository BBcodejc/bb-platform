'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ElitePlayerDashboard, PregameCue, LimitingFactor } from '@/types/elite-player';

export default function AdminPlayerEditorPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [dashboard, setDashboard] = useState<ElitePlayerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'focus' | 'cues' | 'factors' | 'videos' | 'stats' | 'notes'>('focus');

  // Form states
  const [focusText, setFocusText] = useState('');
  const [cues, setCues] = useState<PregameCue[]>([]);
  const [factors, setFactors] = useState<LimitingFactor[]>([]);

  // New item forms
  const [newCue, setNewCue] = useState({ text: '', category: 'shooting' });
  const [newFactor, setNewFactor] = useState({ name: '', description: '', cue: '', severity: 'medium' });
  const [newVideo, setNewVideo] = useState({ title: '', url: '', bbCue: '', tags: '' });
  const [newNote, setNewNote] = useState('');

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

  async function handleSaveFocus() {
    await saveAction('update_focus', { focusCue: focusText, createdBy: 'Admin' });
  }

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

  async function handleAddFactor() {
    if (!newFactor.name.trim()) return;
    await saveAction('add_limiting_factor', {
      name: newFactor.name,
      shortDescription: newFactor.description,
      awarenesssCue: newFactor.cue,
      severity: newFactor.severity,
    });
    setNewFactor({ name: '', description: '', cue: '', severity: 'medium' });
  }

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

  async function handleAddNote() {
    if (!newNote.trim()) return;
    await saveAction('add_coach_note', {
      text: newNote,
      createdBy: 'Admin',
    });
    setNewNote('');
  }

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
            <Link href={`/players/${slug}`} target="_blank">
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-bb-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'focus', label: 'Today\'s Focus', icon: Target },
              { id: 'cues', label: 'Pre-Game Cues', icon: Target },
              { id: 'factors', label: 'Limiting Factors', icon: AlertCircle },
              { id: 'videos', label: 'Videos', icon: Video },
              { id: 'stats', label: 'Game Stats', icon: BarChart3 },
              { id: 'notes', label: 'Coach Notes', icon: FileText },
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
              <Button onClick={handleSaveFocus} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Focus'}
              </Button>
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
                      <span className="flex-1 text-white">{cue.cueText}</span>
                      <span className="text-xs text-gray-500 capitalize">{cue.category}</span>
                      <button
                        onClick={() => handleDeleteCue(cue.id)}
                        className="p-1 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
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
                  placeholder="Awareness cue..."
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
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-white">{factor.name}</h4>
                        <span className={cn(
                          'px-2 py-0.5 text-xs rounded uppercase',
                          factor.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          factor.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        )}>
                          {factor.priority}
                        </span>
                      </div>
                      {factor.shortDescription && (
                        <p className="text-sm text-gray-400 mt-1">{factor.shortDescription}</p>
                      )}
                      {factor.awarenesssCue && (
                        <p className="text-sm text-gold-400 mt-2">
                          <span className="font-medium">Cue:</span> {factor.awarenesssCue}
                        </p>
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
                      </div>
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline text-sm">
                        View
                      </a>
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
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {game.threePointMakes}/{game.threePointAttempts}
                        </p>
                        <p className="text-xs text-gray-500">
                          {game.threePointPercentage?.toFixed(0) || '-'}% 3PT
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
                <Button onClick={handleAddNote} disabled={saving} className="bg-gold-500 hover:bg-gold-600 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
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
                        {note.createdBy && `${note.createdBy} · `}
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
          </div>
        )}
      </main>
    </div>
  );
}
