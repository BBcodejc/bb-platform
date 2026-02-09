'use client';

import { useState, useEffect, useCallback } from 'react';
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
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Video,
  BarChart3,
  Brain,
  Crosshair,
  User,
  Minus,
  FileText,
  Mic,
  Shield,
  Zap,
  Move,
  Hand,
  CircleDot,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  MapPin,
  Check,
  Loader2,
  Download,
  Upload,
  RefreshCw,
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
  PregameCue,
  GameDayProtocol,
  WeeklyReview,
  CoachNote,
  ShotType,
} from '@/types/elite-player';
import {
  DEFAULT_SHOT_TYPES,
  DEFAULT_POST_MOVES,
  DEFAULT_OFF_BALL_PRINCIPLES,
  DEFAULT_DEFENSE_PRINCIPLES,
  DEFAULT_REBOUNDING_PRINCIPLES,
  DEFAULT_HANDLE_PRINCIPLES,
  DEFAULT_FINISHING_PRINCIPLES,
  DEFAULT_SCORING_SETTINGS,
  DEFAULT_PREGAME_SPOTS,
} from '@/types/elite-player';

// ============================================
// CONSTANTS
// ============================================
const COACHES = ['Coach Jake', 'Tommy', 'BB Staff'];

// Import templates for protocols
const PROTOCOL_TEMPLATES = [
  {
    id: 'tommy-default',
    name: "Tommy's Pre-Game Structure",
    description: 'Standard 5-spot rotation with plus/minus scoring',
    data: {
      scoringSettings: DEFAULT_SCORING_SETTINGS,
      spots: DEFAULT_PREGAME_SPOTS,
      shotTypeVariety: DEFAULT_SHOT_TYPES,
      postSection: { enabled: true, moves: DEFAULT_POST_MOVES },
      offBallPrinciples: DEFAULT_OFF_BALL_PRINCIPLES,
      defensePrinciples: DEFAULT_DEFENSE_PRINCIPLES,
      reboundingPrinciples: DEFAULT_REBOUNDING_PRINCIPLES,
      handlePrinciples: DEFAULT_HANDLE_PRINCIPLES,
      finishingPrinciples: DEFAULT_FINISHING_PRINCIPLES,
    },
  },
  {
    id: 'game-day-drills',
    name: 'BB Game Day Drills',
    description: 'Catch variety, back-rim ladder, ball flight spectrum',
    data: {
      scoringSettings: { ...DEFAULT_SCORING_SETTINGS, targetScore: 3 },
      spots: DEFAULT_PREGAME_SPOTS,
      shotTypeVariety: [
        { id: 'catch-high', name: 'Catch & Shoot (High Pass)', category: 'catch-shoot' as const, isActive: true },
        { id: 'catch-mid', name: 'Catch & Shoot (Middle Pass)', category: 'catch-shoot' as const, isActive: true },
        { id: 'catch-low', name: 'Catch & Shoot (Low Pass)', category: 'catch-shoot' as const, isActive: true },
        { id: 'back-rim-ladder', name: 'Back-Rim Response Ladder', category: 'off-dribble' as const, isActive: true },
        { id: 'ball-flight-flat', name: 'Flat Arc (25°)', category: 'catch-shoot' as const, isActive: true },
        { id: 'ball-flight-normal', name: 'Normal Arc (45°)', category: 'catch-shoot' as const, isActive: true },
        { id: 'ball-flight-high', name: 'High Arc (60°)', category: 'catch-shoot' as const, isActive: true },
      ],
      postSection: { enabled: false, moves: [] },
      offBallPrinciples: ['Get the ball to the back rim', 'No mechanical thoughts', 'Same target, different flight'],
      defensePrinciples: DEFAULT_DEFENSE_PRINCIPLES,
      reboundingPrinciples: DEFAULT_REBOUNDING_PRINCIPLES,
      handlePrinciples: DEFAULT_HANDLE_PRINCIPLES,
      finishingPrinciples: ['Leave the gym feeling effortless'],
    },
  },
  {
    id: 'session-a',
    name: 'Session A: Deep Distance + Back Rim',
    description: 'Calibration backbone - deep distance line work',
    data: {
      scoringSettings: { ...DEFAULT_SCORING_SETTINGS, targetScore: 5 },
      spots: [
        { id: 'deep-line', name: 'Deep Distance Line', position: 'top' as const, shotTypes: [], reps: 10 },
        { id: 'step-in-1', name: 'Step In (1 step)', position: 'top' as const, shotTypes: [], reps: 10 },
        { id: 'step-in-2', name: 'Step In (2 steps)', position: 'top' as const, shotTypes: [], reps: 10 },
        { id: 'seven-spot', name: '7-Spot Series', position: 'wing-left' as const, shotTypes: [], reps: 7 },
        { id: 'test-out', name: '14-Spot Test Out', position: 'corner-left' as const, shotTypes: [], reps: 14 },
      ],
      shotTypeVariety: [
        { id: 'pull-up-1', name: '1-Dribble Pull-up', category: 'pull-up' as const, isActive: true },
        { id: 'step-back', name: 'Step-back', category: 'off-dribble' as const, isActive: true },
        { id: 'bounce-pull-up', name: 'Bounce Pull-up (Hang Dribble)', category: 'pull-up' as const, isActive: true },
        { id: 'high-pass', name: 'Off High Pass', category: 'catch-shoot' as const, isActive: true },
        { id: 'mid-pass', name: 'Off Middle Pass', category: 'catch-shoot' as const, isActive: true },
        { id: 'low-pass', name: 'Off Low Pass', category: 'catch-shoot' as const, isActive: true },
      ],
      postSection: { enabled: false, moves: [] },
      offBallPrinciples: ['Back rim = good miss', 'Short misses are the enemy', 'Control the ball to the target'],
      defensePrinciples: DEFAULT_DEFENSE_PRINCIPLES,
      reboundingPrinciples: DEFAULT_REBOUNDING_PRINCIPLES,
      handlePrinciples: ['Solve the distance first', 'No mechanical thoughts'],
      finishingPrinciples: ['Build calibration backbone'],
    },
  },
  {
    id: 'session-c',
    name: 'Session C: Difficult Shooting + Fades',
    description: 'Stress-proof shooting - fade adaptability',
    data: {
      scoringSettings: { ...DEFAULT_SCORING_SETTINGS, targetScore: 5 },
      spots: [
        { id: 'fade-spot-1', name: '7-Spot Fades', position: 'corner-left' as const, shotTypes: [], reps: 7 },
        { id: 'deep-fade', name: 'Deep Distance Fade', position: 'top' as const, shotTypes: [], reps: 8 },
        { id: 'fade-test-l', name: '14-Spot Fade Left', position: 'wing-left' as const, shotTypes: [], reps: 14 },
        { id: 'fade-test-r', name: '14-Spot Fade Right', position: 'wing-right' as const, shotTypes: [], reps: 14 },
      ],
      shotTypeVariety: [
        { id: 'fade-right', name: 'Fade Right', category: 'off-dribble' as const, isActive: true },
        { id: 'fade-left', name: 'Fade Left', category: 'off-dribble' as const, isActive: true },
        { id: 'fade-backward', name: 'Fade Backward / Drift', category: 'off-dribble' as const, isActive: true },
        { id: 'off-dribble-fade', name: 'Off-Dribble Fade', category: 'off-dribble' as const, isActive: true },
      ],
      postSection: { enabled: true, moves: ['Fade left shoulder (aggressive)', 'Fade right shoulder (aggressive)', 'Stepback from block'] },
      offBallPrinciples: ['Games demand awkward shots', 'Train difficulty directly'],
      defensePrinciples: DEFAULT_DEFENSE_PRINCIPLES,
      reboundingPrinciples: DEFAULT_REBOUNDING_PRINCIPLES,
      handlePrinciples: DEFAULT_HANDLE_PRINCIPLES,
      finishingPrinciples: ['Become stress-proof'],
    },
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  shooting: 'text-gold-500 bg-gold-500/10 border-gold-500/30',
  decision: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  mindset: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  movement: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  defense: 'text-red-400 bg-red-500/10 border-red-500/30',
  rebounding: 'text-green-400 bg-green-500/10 border-green-500/30',
  handle: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  finishing: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
};

const SEVERITY_COLORS: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400 border-red-500/40',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  low: 'bg-green-500/20 text-green-400 border-green-500/40',
};

// ============================================
// SUB-COMPONENTS
// ============================================

function BBLevelBadge({ level, levelName }: { level: number; levelName?: string }) {
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
              'w-2 h-6 rounded-sm transition-all',
              l <= level ? 'bg-gold-500' : 'bg-gray-700'
            )}
          />
        ))}
      </div>
      <span className="text-gold-500 font-semibold text-sm">
        {levelName || `BB ${level} - ${levelNames[level]}`}
      </span>
    </div>
  );
}

function SectionHeader({
  title,
  icon,
  isOpen,
  onToggle,
  isAdmin,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  saving,
  badge,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isAdmin?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  saving?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors rounded-t-xl">
      <div className="flex items-center gap-3" onClick={onToggle}>
        <div className="text-gold-500">{icon}</div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {badge}
      </div>
      <div className="flex items-center gap-2">
        {isAdmin && !isEditing && onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4 text-blue-400" />
          </button>
        )}
        {isAdmin && isEditing && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onCancel?.(); }}
              className="p-2 hover:bg-gray-500/20 rounded-lg transition-colors"
              disabled={saving}
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onSave?.(); }}
              className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
              ) : (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </button>
          </>
        )}
        <button onClick={onToggle} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}

function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, React.ReactNode> = {
    shooting: <Target className="w-4 h-4" />,
    decision: <Brain className="w-4 h-4" />,
    mindset: <Flame className="w-4 h-4" />,
    movement: <Move className="w-4 h-4" />,
    defense: <Shield className="w-4 h-4" />,
    rebounding: <Zap className="w-4 h-4" />,
    handle: <Hand className="w-4 h-4" />,
    finishing: <CircleDot className="w-4 h-4" />,
  };
  return <span className={cn('p-1 rounded', CATEGORY_COLORS[category])}>{icons[category] || icons.shooting}</span>;
}

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={cn(
      'px-2 py-0.5 text-xs font-bold rounded border uppercase tracking-wide',
      SEVERITY_COLORS[severity] || SEVERITY_COLORS.medium
    )}>
      {severity}
    </span>
  );
}

function VideoTag({ tag }: { tag: string }) {
  const colors: Record<string, string> = {
    'catch-and-shoot': 'bg-blue-500/20 text-blue-400',
    'off-dribble': 'bg-purple-500/20 text-purple-400',
    'game-clip': 'bg-red-500/20 text-red-400',
    training: 'bg-emerald-500/20 text-emerald-400',
    'deep-distance': 'bg-orange-500/20 text-orange-400',
  };
  return (
    <span className={cn('px-2 py-0.5 text-xs rounded', colors[tag] || 'bg-gray-500/20 text-gray-400')}>
      {tag.replace(/-/g, ' ')}
    </span>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ElitePlayerDashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isAdmin = searchParams.get('admin') === 'true';

  const [dashboard, setDashboard] = useState<ElitePlayerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState('Coach Jake');

  // Section open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    focus: true,
    cues: true,
    protocol: true,
    factors: true,
    weekly: false,
    stats: true,
    games: true,
    videos: false,
    notes: false,
    checkin: false,
  });

  // Editing states
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Form states for editing
  const [focusText, setFocusText] = useState('');
  const [editingCues, setEditingCues] = useState<PregameCue[]>([]);
  const [editingFactors, setEditingFactors] = useState<LimitingFactor[]>([]);
  const [newCueText, setNewCueText] = useState('');
  const [newCueCategory, setNewCueCategory] = useState('shooting');

  // Weekly review editing state
  const [editingWeekly, setEditingWeekly] = useState<WeeklyReview | null>(null);

  // New game form state
  const [newGame, setNewGame] = useState({
    opponent: '',
    gameDate: new Date().toISOString().split('T')[0],
    isHome: true,
    minutesPlayed: 0,
    threePointAttempts: 0,
    threePointMakes: 0,
    points: 0,
    bbNotes: '',
    huntingNextGame: '',
  });

  // New video form state
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    tags: [] as string[],
    bbCue: '',
  });

  // New coach note state
  const [newCoachNote, setNewCoachNote] = useState('');

  // Protocol editing state
  const [editingProtocol, setEditingProtocol] = useState<GameDayProtocol | null>(null);
  const [newShotType, setNewShotType] = useState('');
  const [newPostMove, setNewPostMove] = useState('');
  const [newPrinciple, setNewPrinciple] = useState({ category: 'offBall', text: '' });
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingHeadshot, setEditingHeadshot] = useState(false);
  const [headshotUrl, setHeadshotUrl] = useState('');

  // Fetch dashboard
  useEffect(() => {
    fetchDashboard();
  }, [slug]);

  async function fetchDashboard() {
    try {
      setLoading(true);
      const res = await fetch(`/api/elite-players/${slug}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setDashboard(data);
      setFocusText(data.todaysFocus?.focusCue || '');
      setEditingCues(data.pregameCues || data.dailyCues || []);
      setEditingFactors(data.limitingFactors || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
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
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchDashboard();
        setEditingSection(null);
        return true;
      } else {
        console.error('Save failed:', data);
        alert(`Save failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(`Save error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
    return false;
  }

  function toggleSection(section: string) {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  }

  function startEditing(section: string) {
    setEditingSection(section);
    if (section === 'focus') {
      setFocusText(dashboard?.todaysFocus?.focusCue || '');
    } else if (section === 'cues') {
      setEditingCues([...(dashboard?.pregameCues || dashboard?.dailyCues || [])]);
    } else if (section === 'factors') {
      setEditingFactors([...(dashboard?.limitingFactors || [])]);
    } else if (section === 'weekly') {
      setEditingWeekly(dashboard?.weeklyReview ? { ...dashboard.weeklyReview } : {
        id: '',
        playerId: dashboard?.player.id || '',
        weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weekEnd: new Date().toISOString().split('T')[0],
        summary: '',
        whatChanged: [],
        priorities: [],
        shootingTrend: 'stable',
      });
    } else if (section === 'games') {
      setNewGame({
        opponent: '',
        gameDate: new Date().toISOString().split('T')[0],
        isHome: true,
        minutesPlayed: 0,
        threePointAttempts: 0,
        threePointMakes: 0,
        points: 0,
        bbNotes: '',
        huntingNextGame: '',
      });
    } else if (section === 'videos') {
      setNewVideo({
        title: '',
        url: '',
        tags: [],
        bbCue: '',
      });
    } else if (section === 'notes') {
      setNewCoachNote('');
    } else if (section === 'protocol') {
      setEditingProtocol(dashboard?.gameDayProtocol ? JSON.parse(JSON.stringify(dashboard.gameDayProtocol)) : null);
    }
  }

  function cancelEditing() {
    setEditingSection(null);
    setFocusText(dashboard?.todaysFocus?.focusCue || '');
    setEditingCues(dashboard?.pregameCues || dashboard?.dailyCues || []);
    setEditingFactors(dashboard?.limitingFactors || []);
    setEditingWeekly(null);
    setNewGame({
      opponent: '',
      gameDate: new Date().toISOString().split('T')[0],
      isHome: true,
      minutesPlayed: 0,
      threePointAttempts: 0,
      threePointMakes: 0,
      points: 0,
      bbNotes: '',
      huntingNextGame: '',
    });
    setNewVideo({ title: '', url: '', tags: [], bbCue: '' });
    setNewCoachNote('');
    setEditingProtocol(null);
    setNewShotType('');
    setNewPostMove('');
    setNewPrinciple({ category: 'offBall', text: '' });
  }

  // Save handlers
  async function saveFocus() {
    await saveAction('update_focus', { focusCue: focusText, createdBy: selectedCoach });
  }

  async function saveCues() {
    await saveAction('update_daily_cues', {
      cues: editingCues.map((c, i) => ({
        id: c.id?.startsWith('new-') ? undefined : c.id,
        cueText: c.cueText,
        category: c.category,
        displayOrder: i,
        isActive: true,
      })),
    });
  }

  async function saveFactors() {
    // Save each factor
    for (const factor of editingFactors) {
      if (factor.id?.startsWith('new-')) {
        await saveAction('add_limiting_factor', {
          name: factor.name,
          shortDescription: factor.shortDescription,
          awarenesssCue: factor.awarenesssCue,
          severity: factor.severity || factor.priority,
          notes: factor.notes,
        });
      } else {
        await saveAction('update_limiting_factor', {
          id: factor.id,
          name: factor.name,
          shortDescription: factor.shortDescription,
          awarenesssCue: factor.awarenesssCue,
          severity: factor.severity || factor.priority,
          notes: factor.notes,
        });
      }
    }
    setEditingSection(null);
    await fetchDashboard();
  }

  async function saveWeeklyReview() {
    if (!editingWeekly) return;
    await saveAction('update_weekly_review', {
      summary: editingWeekly.summary,
      whatChanged: editingWeekly.whatChanged,
      priorities: editingWeekly.priorities,
      shootingTrend: editingWeekly.shootingTrend,
      createdBy: selectedCoach,
    });
  }

  async function addGame() {
    if (!newGame.opponent.trim()) return;
    await saveAction('add_game_report', {
      ...newGame,
      createdBy: selectedCoach,
    });
    setNewGame({
      opponent: '',
      gameDate: new Date().toISOString().split('T')[0],
      isHome: true,
      minutesPlayed: 0,
      threePointAttempts: 0,
      threePointMakes: 0,
      points: 0,
      bbNotes: '',
      huntingNextGame: '',
    });
  }

  async function addVideo() {
    if (!newVideo.title.trim() || !newVideo.url.trim()) return;
    await saveAction('add_video', {
      title: newVideo.title,
      url: newVideo.url,
      tags: newVideo.tags,
      bbCue: newVideo.bbCue,
    });
    setNewVideo({ title: '', url: '', tags: [], bbCue: '' });
  }

  async function deleteVideo(videoId: string) {
    await saveAction('delete_video', { id: videoId });
  }

  async function addCoachNote() {
    if (!newCoachNote.trim()) return;
    await saveAction('add_coach_note', {
      text: newCoachNote,
      createdBy: selectedCoach,
    });
    setNewCoachNote('');
  }

  async function saveProtocol() {
    if (!editingProtocol) return;
    await saveAction('update_protocol', {
      scoringSettings: editingProtocol.scoringSettings,
      spots: editingProtocol.spots,
      shotTypeVariety: editingProtocol.shotTypeVariety,
      postSection: editingProtocol.postSection,
      offBallPrinciples: editingProtocol.offBallPrinciples,
      defensePrinciples: editingProtocol.defensePrinciples,
      reboundingPrinciples: editingProtocol.reboundingPrinciples,
      handlePrinciples: editingProtocol.handlePrinciples,
      finishingPrinciples: editingProtocol.finishingPrinciples,
    });
  }

  // Protocol editing helpers
  function updateSpotReps(spotId: string, reps: number) {
    if (!editingProtocol) return;
    setEditingProtocol({
      ...editingProtocol,
      spots: editingProtocol.spots.map(s =>
        s.id === spotId ? { ...s, reps } : s
      ),
    });
  }

  function toggleShotType(shotId: string) {
    if (!editingProtocol) return;
    setEditingProtocol({
      ...editingProtocol,
      shotTypeVariety: editingProtocol.shotTypeVariety.map(s =>
        s.id === shotId ? { ...s, isActive: !s.isActive } : s
      ),
    });
  }

  function addShotType() {
    if (!editingProtocol || !newShotType.trim()) return;
    const newShot = {
      id: `custom-${Date.now()}`,
      name: newShotType,
      category: 'off-dribble' as const,
      isActive: true,
    };
    setEditingProtocol({
      ...editingProtocol,
      shotTypeVariety: [...editingProtocol.shotTypeVariety, newShot],
    });
    setNewShotType('');
  }

  function removeShotType(shotId: string) {
    if (!editingProtocol) return;
    setEditingProtocol({
      ...editingProtocol,
      shotTypeVariety: editingProtocol.shotTypeVariety.filter(s => s.id !== shotId),
    });
  }

  function addPostMove() {
    if (!editingProtocol || !newPostMove.trim()) return;
    setEditingProtocol({
      ...editingProtocol,
      postSection: {
        ...editingProtocol.postSection,
        moves: [...editingProtocol.postSection.moves, newPostMove],
      },
    });
    setNewPostMove('');
  }

  function removePostMove(index: number) {
    if (!editingProtocol) return;
    setEditingProtocol({
      ...editingProtocol,
      postSection: {
        ...editingProtocol.postSection,
        moves: editingProtocol.postSection.moves.filter((_, i) => i !== index),
      },
    });
  }

  function addPrinciple() {
    if (!editingProtocol || !newPrinciple.text.trim()) return;
    const key = `${newPrinciple.category}Principles` as keyof GameDayProtocol;
    const currentPrinciples = (editingProtocol[key] as string[]) || [];
    setEditingProtocol({
      ...editingProtocol,
      [key]: [...currentPrinciples, newPrinciple.text],
    });
    setNewPrinciple({ ...newPrinciple, text: '' });
  }

  function removePrinciple(category: string, index: number) {
    if (!editingProtocol) return;
    const key = `${category}Principles` as keyof GameDayProtocol;
    const currentPrinciples = (editingProtocol[key] as string[]) || [];
    setEditingProtocol({
      ...editingProtocol,
      [key]: currentPrinciples.filter((_, i) => i !== index),
    });
  }

  function updateTargetScore(score: number) {
    if (!editingProtocol) return;
    setEditingProtocol({
      ...editingProtocol,
      scoringSettings: {
        ...editingProtocol.scoringSettings,
        targetScore: score,
      },
    });
  }

  function importProtocolTemplate(templateId: string) {
    const template = PROTOCOL_TEMPLATES.find(t => t.id === templateId);
    if (!template || !editingProtocol) return;

    setEditingProtocol({
      ...editingProtocol,
      scoringSettings: template.data.scoringSettings,
      spots: template.data.spots,
      shotTypeVariety: template.data.shotTypeVariety,
      postSection: template.data.postSection,
      offBallPrinciples: template.data.offBallPrinciples,
      defensePrinciples: template.data.defensePrinciples,
      reboundingPrinciples: template.data.reboundingPrinciples,
      handlePrinciples: template.data.handlePrinciples,
      finishingPrinciples: template.data.finishingPrinciples,
    });
    setShowImportModal(false);
  }

  function resetProtocolToDefaults() {
    if (!editingProtocol) return;
    setEditingProtocol({
      ...editingProtocol,
      scoringSettings: DEFAULT_SCORING_SETTINGS,
      spots: DEFAULT_PREGAME_SPOTS,
      shotTypeVariety: DEFAULT_SHOT_TYPES,
      postSection: { enabled: true, moves: DEFAULT_POST_MOVES },
      offBallPrinciples: DEFAULT_OFF_BALL_PRINCIPLES,
      defensePrinciples: DEFAULT_DEFENSE_PRINCIPLES,
      reboundingPrinciples: DEFAULT_REBOUNDING_PRINCIPLES,
      handlePrinciples: DEFAULT_HANDLE_PRINCIPLES,
      finishingPrinciples: DEFAULT_FINISHING_PRINCIPLES,
    });
  }

  async function saveHeadshot() {
    if (!headshotUrl.trim()) return;
    await saveAction('update_player', { headshotUrl });
    setEditingHeadshot(false);
  }

  // Cue handlers
  function addCue() {
    if (!newCueText.trim()) return;
    setEditingCues([
      ...editingCues,
      {
        id: `new-${Date.now()}`,
        playerId: dashboard?.player.id || '',
        cueText: newCueText,
        category: newCueCategory as any,
        displayOrder: editingCues.length,
        isActive: true,
      },
    ]);
    setNewCueText('');
  }

  function updateCue(index: number, field: string, value: string) {
    const updated = [...editingCues];
    (updated[index] as any)[field] = value;
    setEditingCues(updated);
  }

  function deleteCue(index: number) {
    setEditingCues(editingCues.filter((_, i) => i !== index));
  }

  function moveCue(index: number, direction: 'up' | 'down') {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === editingCues.length - 1)) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...editingCues];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setEditingCues(updated);
  }

  // Factor handlers
  function addFactor() {
    setEditingFactors([
      ...editingFactors,
      {
        id: `new-${Date.now()}`,
        playerId: dashboard?.player.id || '',
        name: 'New Factor',
        shortDescription: '',
        awarenesssCue: '',
        severity: 'medium',
        priority: 'medium',
        isActive: true,
      },
    ]);
  }

  function updateFactor(index: number, field: string, value: string) {
    const updated = [...editingFactors];
    (updated[index] as any)[field] = value;
    setEditingFactors(updated);
  }

  function deleteFactor(index: number) {
    setEditingFactors(editingFactors.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">{error || 'Dashboard not found'}</p>
        </div>
      </div>
    );
  }

  const { player, todaysFocus, pregameCues, dailyCues, limitingFactors, gameDayProtocol, weeklyReview, recentGames, stats, videoLibrary, coachNotes } = dashboard;
  const cues = pregameCues || dailyCues || [];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Admin Bar */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/5 border-b border-gold-500/20 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-gold-500" />
              <span className="text-gold-500 text-sm font-medium">Admin Mode</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Editing as:</span>
              <select
                value={selectedCoach}
                onChange={(e) => setSelectedCoach(e.target.value)}
                className="px-3 py-1 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-white text-sm"
              >
                {COACHES.map(coach => (
                  <option key={coach} value={coach}>{coach}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-lg border-b border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Player Avatar / Headshot */}
              <div className="relative group">
                {player.headshotUrl ? (
                  <img
                    src={player.headshotUrl}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/30"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/10 border-2 border-gold-500/30 flex items-center justify-center">
                    <User className="w-7 h-7 text-gold-500" />
                  </div>
                )}
                {isAdmin && (
                  <button
                    onClick={() => {
                      setHeadshotUrl(player.headshotUrl || '');
                      setEditingHeadshot(true);
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit3 className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {player.firstName} {player.lastName}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{player.position}</span>
                  <span className="text-gray-600">·</span>
                  <span>{player.team}</span>
                </div>
              </div>
            </div>
{/* BB Level Badge - hidden for now */}
          </div>
        </div>
      </header>

      {/* Headshot Edit Modal */}
      {editingHeadshot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold text-white">Update Player Photo</h3>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Image URL</label>
              <Input
                value={headshotUrl}
                onChange={(e) => setHeadshotUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="bg-[#0D0D0D] border-[#2A2A2A]"
              />
              <p className="text-xs text-gray-500 mt-2">
                Paste a direct image URL (NBA headshots, team photos, etc.)
              </p>
            </div>
            {headshotUrl && (
              <div className="flex justify-center">
                <img
                  src={headshotUrl}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gold-500/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setEditingHeadshot(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={saveHeadshot}
                className="bg-gold-500 hover:bg-gold-600 text-black"
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Photo'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* TODAY'S FOCUS */}
        <section className="bg-gradient-to-br from-gold-500/10 to-gold-600/5 border border-gold-500/20 rounded-2xl overflow-hidden">
          <SectionHeader
            title="Today's Focus"
            icon={<Crosshair className="w-5 h-5" />}
            isOpen={openSections.focus}
            onToggle={() => toggleSection('focus')}
            isAdmin={isAdmin}
            isEditing={editingSection === 'focus'}
            onEdit={() => startEditing('focus')}
            onSave={saveFocus}
            onCancel={cancelEditing}
            saving={saving}
          />
          {openSections.focus && (
            <div className="px-4 pb-4">
              {editingSection === 'focus' ? (
                <Textarea
                  value={focusText}
                  onChange={(e) => setFocusText(e.target.value)}
                  className="bg-[#0D0D0D] border-gold-500/30 focus:border-gold-500 text-lg"
                  rows={3}
                  placeholder="Enter today's focus..."
                />
              ) : (
                <p className="text-xl text-white font-medium leading-relaxed">
                  {todaysFocus?.focusCue || <span className="text-gray-500 italic">No focus set for today</span>}
                </p>
              )}
              {todaysFocus?.createdBy && !editingSection && (
                <p className="mt-3 text-sm text-gray-500">
                  Set by {todaysFocus.createdBy} · {new Date().toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </section>

        {/* PRE-GAME CUES */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          <SectionHeader
            title="Pre-Game Cues"
            icon={<Target className="w-5 h-5" />}
            isOpen={openSections.cues}
            onToggle={() => toggleSection('cues')}
            isAdmin={isAdmin}
            isEditing={editingSection === 'cues'}
            onEdit={() => startEditing('cues')}
            onSave={saveCues}
            onCancel={cancelEditing}
            saving={saving}
            badge={<span className="text-xs text-gray-500 bg-[#2A2A2A] px-2 py-0.5 rounded-full">{cues.length}</span>}
          />
          {openSections.cues && (
            <div className="px-4 pb-4 space-y-2">
              {editingSection === 'cues' ? (
                <>
                  {editingCues.map((cue, i) => (
                    <div key={cue.id} className="flex items-center gap-2 p-3 bg-[#0D0D0D] rounded-xl border border-[#2A2A2A]">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveCue(i, 'up')} disabled={i === 0} className="text-gray-500 hover:text-white disabled:opacity-30">
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button onClick={() => moveCue(i, 'down')} disabled={i === editingCues.length - 1} className="text-gray-500 hover:text-white disabled:opacity-30">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-gold-500 font-bold w-6">{i + 1}</span>
                      <Input
                        value={cue.cueText}
                        onChange={(e) => updateCue(i, 'cueText', e.target.value)}
                        className="flex-1 bg-transparent border-[#2A2A2A]"
                      />
                      <select
                        value={cue.category}
                        onChange={(e) => updateCue(i, 'category', e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm"
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
                      <button onClick={() => deleteCue(i)} className="p-2 hover:bg-red-500/20 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 p-3 bg-[#0D0D0D]/50 rounded-xl border border-dashed border-[#2A2A2A]">
                    <Plus className="w-4 h-4 text-gray-500" />
                    <Input
                      value={newCueText}
                      onChange={(e) => setNewCueText(e.target.value)}
                      placeholder="Add new cue..."
                      className="flex-1 bg-transparent border-none"
                      onKeyDown={(e) => e.key === 'Enter' && addCue()}
                    />
                    <select
                      value={newCueCategory}
                      onChange={(e) => setNewCueCategory(e.target.value)}
                      className="px-2 py-1.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm"
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
                    <Button onClick={addCue} size="sm" className="bg-gold-500 hover:bg-gold-600 text-black">
                      Add
                    </Button>
                  </div>
                </>
              ) : cues.length > 0 ? (
                cues.map((cue, i) => (
                  <div key={cue.id} className="flex items-center gap-3 p-3 bg-[#0D0D0D]/50 rounded-xl">
                    <span className="text-gold-500 font-bold text-lg w-6">{i + 1}</span>
                    <CategoryIcon category={cue.category} />
                    <span className="text-white flex-1">{cue.cueText}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6 italic">No cues set</p>
              )}
            </div>
          )}
        </section>

        {/* GAME DAY PROTOCOL */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          <SectionHeader
            title="Game Day Protocol"
            icon={<CircleDot className="w-5 h-5" />}
            isOpen={openSections.protocol}
            onToggle={() => toggleSection('protocol')}
            isAdmin={isAdmin}
            isEditing={editingSection === 'protocol'}
            onEdit={() => startEditing('protocol')}
            onSave={saveProtocol}
            onCancel={cancelEditing}
            saving={saving}
            badge={<span className="text-xs text-gray-500">{gameDayProtocol?.duration || '15-20 min'}</span>}
          />
          {openSections.protocol && (
            <div className="px-4 pb-4 space-y-6">
              {editingSection === 'protocol' && editingProtocol ? (
                <>
                  {/* Import Templates Bar */}
                  <div className="flex items-center justify-between p-3 bg-gold-500/10 border border-gold-500/20 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-gold-500" />
                      <span className="text-sm text-gold-500 font-medium">Import Template</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowImportModal(!showImportModal)}
                        className="px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-black text-sm font-medium rounded-lg transition-colors"
                      >
                        Browse Templates
                      </button>
                      <button
                        onClick={resetProtocolToDefaults}
                        className="px-3 py-1.5 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Reset to Defaults
                      </button>
                    </div>
                  </div>

                  {/* Import Modal */}
                  {showImportModal && (
                    <div className="p-4 bg-[#0D0D0D] rounded-xl border-2 border-gold-500/30 space-y-3">
                      <h4 className="text-sm font-semibold text-gold-500 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Select a Template to Import
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {PROTOCOL_TEMPLATES.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => importProtocolTemplate(template.id)}
                            className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-left hover:border-gold-500/50 transition-colors"
                          >
                            <p className="font-medium text-white">{template.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowImportModal(false)}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Editable Scoring */}
                  <div className="p-4 bg-[#0D0D0D] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-400">Scoring Target</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Plus</span>
                        <select
                          value={editingProtocol.scoringSettings.targetScore}
                          onChange={(e) => updateTargetScore(parseInt(e.target.value))}
                          className="px-3 py-1 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-white"
                        >
                          {[3, 5, 7, 10].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-400">
                      <span>Make = +1</span>
                      <span>Back Rim = 0</span>
                      <span>Front Rim = -1</span>
                      <span>L/R Miss = -1</span>
                    </div>
                  </div>

                  {/* Editable 5-Spot Rotation */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">5-Spot Rotation (adjust reps)</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {editingProtocol.spots.map((spot) => (
                        <div key={spot.id} className="p-3 bg-[#0D0D0D] rounded-xl text-center border border-[#2A2A2A]">
                          <p className="text-white font-medium text-sm mb-2">{spot.name}</p>
                          <Input
                            type="number"
                            value={spot.reps}
                            onChange={(e) => updateSpotReps(spot.id, parseInt(e.target.value) || 0)}
                            className="w-full text-center bg-[#1A1A1A] border-[#2A2A2A] text-sm"
                            min={1}
                            max={20}
                          />
                          <p className="text-xs text-gray-500 mt-1">reps</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Editable Shot Types */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Shot Type Variety (click to toggle)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {editingProtocol.shotTypeVariety.map((shot) => (
                        <div
                          key={shot.id}
                          onClick={() => toggleShotType(shot.id)}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all',
                            shot.isActive
                              ? 'bg-[#0D0D0D] border border-gold-500/30'
                              : 'bg-[#0D0D0D]/30 border border-[#2A2A2A] opacity-50'
                          )}
                        >
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            shot.category === 'catch-shoot' ? 'bg-blue-400' :
                            shot.category === 'off-dribble' ? 'bg-purple-400' :
                            shot.category === 'pull-up' ? 'bg-orange-400' : 'bg-gray-400'
                          )} />
                          <span className={cn('text-sm flex-1', shot.isActive ? 'text-gray-300' : 'text-gray-500')}>
                            {shot.name}
                          </span>
                          {shot.id.startsWith('custom-') && (
                            <button
                              onClick={(e) => { e.stopPropagation(); removeShotType(shot.id); }}
                              className="p-1 hover:bg-red-500/20 rounded"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Input
                        value={newShotType}
                        onChange={(e) => setNewShotType(e.target.value)}
                        placeholder="Add custom shot type..."
                        className="flex-1 bg-[#0D0D0D] border-[#2A2A2A]"
                        onKeyDown={(e) => e.key === 'Enter' && addShotType()}
                      />
                      <Button onClick={addShotType} size="sm" className="bg-gold-500 hover:bg-gold-600 text-black">
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Editable Post Work */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-400">Post Work</h4>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingProtocol.postSection.enabled}
                          onChange={(e) => setEditingProtocol({
                            ...editingProtocol,
                            postSection: { ...editingProtocol.postSection, enabled: e.target.checked }
                          })}
                          className="rounded border-[#2A2A2A]"
                        />
                        <span className="text-xs text-gray-400">Enabled</span>
                      </label>
                    </div>
                    {editingProtocol.postSection.enabled && (
                      <>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {editingProtocol.postSection.moves.map((move, i) => (
                            <span key={i} className="group px-3 py-1.5 rounded-full bg-[#0D0D0D] border border-[#2A2A2A] text-sm text-gray-300 flex items-center gap-2">
                              {move}
                              <button onClick={() => removePostMove(i)} className="opacity-0 group-hover:opacity-100">
                                <X className="w-3 h-3 text-red-400" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={newPostMove}
                            onChange={(e) => setNewPostMove(e.target.value)}
                            placeholder="Add post move..."
                            className="flex-1 bg-[#0D0D0D] border-[#2A2A2A]"
                            onKeyDown={(e) => e.key === 'Enter' && addPostMove()}
                          />
                          <Button onClick={addPostMove} size="sm" className="bg-gold-500 hover:bg-gold-600 text-black">
                            Add
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Editable Principles */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Movement Principles</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { key: 'offBall', title: 'Off Ball', items: editingProtocol.offBallPrinciples, icon: Move },
                        { key: 'defense', title: 'Defense', items: editingProtocol.defensePrinciples, icon: Shield },
                        { key: 'rebounding', title: 'Rebounding', items: editingProtocol.reboundingPrinciples, icon: Zap },
                        { key: 'handle', title: 'Handle', items: editingProtocol.handlePrinciples, icon: Hand },
                        { key: 'finishing', title: 'Finishing', items: editingProtocol.finishingPrinciples, icon: CircleDot },
                      ].map((section) => (
                        <div key={section.key} className="p-3 bg-[#0D0D0D]/50 rounded-xl">
                          <div className="flex items-center gap-2 mb-2 text-gray-400">
                            <section.icon className="w-3 h-3" />
                            <span className="text-xs font-medium uppercase">{section.title}</span>
                          </div>
                          <ul className="space-y-1 mb-2">
                            {(section.items || []).map((item, i) => (
                              <li key={i} className="flex items-center justify-between text-xs text-gray-400 group">
                                <span>• {item}</span>
                                <button
                                  onClick={() => removePrinciple(section.key, i)}
                                  className="opacity-0 group-hover:opacity-100 p-1"
                                >
                                  <X className="w-3 h-3 text-red-400" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <select
                        value={newPrinciple.category}
                        onChange={(e) => setNewPrinciple({ ...newPrinciple, category: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm"
                      >
                        <option value="offBall">Off Ball</option>
                        <option value="defense">Defense</option>
                        <option value="rebounding">Rebounding</option>
                        <option value="handle">Handle</option>
                        <option value="finishing">Finishing</option>
                      </select>
                      <Input
                        value={newPrinciple.text}
                        onChange={(e) => setNewPrinciple({ ...newPrinciple, text: e.target.value })}
                        placeholder="Add principle..."
                        className="flex-1 bg-[#0D0D0D] border-[#2A2A2A]"
                        onKeyDown={(e) => e.key === 'Enter' && addPrinciple()}
                      />
                      <Button onClick={addPrinciple} size="sm" className="bg-gold-500 hover:bg-gold-600 text-black">
                        Add
                      </Button>
                    </div>
                  </div>
                </>
              ) : gameDayProtocol ? (
                <>
                  {/* Display Mode - Scoring */}
                  <div className="p-4 bg-[#0D0D0D] rounded-xl">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Scoring: Plus {gameDayProtocol.scoringSettings.targetScore}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 text-sm">Make = +1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MinusCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300 text-sm">Back Rim = 0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-gray-300 text-sm">Front Rim = -1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-gray-300 text-sm">L/R Miss = -1</span>
                      </div>
                    </div>
                  </div>

                  {/* Display Mode - 5-Spot Rotation */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">5-Spot Rotation</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {gameDayProtocol.spots.map((spot) => (
                        <div key={spot.id} className="p-3 bg-[#0D0D0D] rounded-xl text-center border border-[#2A2A2A] hover:border-gold-500/30 transition-colors">
                          <p className="text-white font-medium text-sm">{spot.name}</p>
                          <p className="text-xs text-gray-500">{spot.reps} reps</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Display Mode - Shot Type Variety */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Shot Type Variety</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {gameDayProtocol.shotTypeVariety.filter(s => s.isActive).map((shot) => (
                        <div key={shot.id} className="flex items-center gap-2 p-2 bg-[#0D0D0D]/50 rounded-lg">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            shot.category === 'catch-shoot' ? 'bg-blue-400' :
                            shot.category === 'off-dribble' ? 'bg-purple-400' :
                            shot.category === 'pull-up' ? 'bg-orange-400' : 'bg-gray-400'
                          )} />
                          <span className="text-sm text-gray-300">{shot.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Display Mode - Post Work */}
                  {gameDayProtocol.postSection.enabled && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Post Work</h4>
                      <div className="flex flex-wrap gap-2">
                        {gameDayProtocol.postSection.moves.map((move, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-full bg-[#0D0D0D] border border-[#2A2A2A] text-sm text-gray-300">
                            {move}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Display Mode - Principles Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { title: 'Off Ball', items: gameDayProtocol.offBallPrinciples, icon: Move },
                      { title: 'Defense', items: gameDayProtocol.defensePrinciples, icon: Shield },
                      { title: 'Rebounding', items: gameDayProtocol.reboundingPrinciples, icon: Zap },
                      { title: 'Handle', items: gameDayProtocol.handlePrinciples, icon: Hand },
                      { title: 'Finishing', items: gameDayProtocol.finishingPrinciples, icon: CircleDot },
                    ].map((section) => section.items && section.items.length > 0 && (
                      <div key={section.title} className="p-3 bg-[#0D0D0D]/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                          <section.icon className="w-3 h-3" />
                          <span className="text-xs font-medium uppercase">{section.title}</span>
                        </div>
                        <ul className="space-y-1">
                          {section.items.map((item, i) => (
                            <li key={i} className="text-xs text-gray-400">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-6 italic">No protocol configured yet</p>
              )}
            </div>
          )}
        </section>

        {/* BB LIMITING FACTORS */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          <SectionHeader
            title="BB Limiting Factors"
            icon={<AlertCircle className="w-5 h-5" />}
            isOpen={openSections.factors}
            onToggle={() => toggleSection('factors')}
            isAdmin={isAdmin}
            isEditing={editingSection === 'factors'}
            onEdit={() => startEditing('factors')}
            onSave={saveFactors}
            onCancel={cancelEditing}
            saving={saving}
            badge={<span className="text-xs text-gray-500 bg-[#2A2A2A] px-2 py-0.5 rounded-full">{limitingFactors.length}</span>}
          />
          {openSections.factors && (
            <div className="px-4 pb-4 space-y-3">
              {editingSection === 'factors' ? (
                <>
                  {editingFactors.map((factor, i) => (
                    <div key={factor.id} className="p-4 bg-[#0D0D0D] rounded-xl border border-[#2A2A2A] space-y-3">
                      <div className="flex items-start gap-3">
                        <Input
                          value={factor.name}
                          onChange={(e) => updateFactor(i, 'name', e.target.value)}
                          className="flex-1 bg-transparent border-[#2A2A2A] font-semibold"
                          placeholder="Factor name..."
                        />
                        <select
                          value={factor.severity || factor.priority}
                          onChange={(e) => updateFactor(i, 'severity', e.target.value)}
                          className="px-2 py-1.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm"
                        >
                          <option value="high">HIGH</option>
                          <option value="medium">MEDIUM</option>
                          <option value="low">LOW</option>
                        </select>
                        <button onClick={() => deleteFactor(i)} className="p-2 hover:bg-red-500/20 rounded-lg">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                      <Textarea
                        value={factor.shortDescription || ''}
                        onChange={(e) => updateFactor(i, 'shortDescription', e.target.value)}
                        className="bg-transparent border-[#2A2A2A] text-sm"
                        placeholder="Description..."
                        rows={2}
                      />
                      <div className="p-3 bg-gold-500/5 rounded-lg border border-gold-500/20">
                        <label className="text-xs text-gold-500 font-medium">Awareness Cue:</label>
                        <Textarea
                          value={factor.awarenesssCue || ''}
                          onChange={(e) => updateFactor(i, 'awarenesssCue', e.target.value)}
                          className="bg-transparent border-none text-gold-400 text-sm mt-1 p-0"
                          placeholder="What should the player be aware of?"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addFactor}
                    className="w-full p-4 border border-dashed border-[#2A2A2A] rounded-xl text-gray-500 hover:text-white hover:border-gold-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Limiting Factor
                  </button>
                </>
              ) : limitingFactors.length > 0 ? (
                limitingFactors.map((factor) => (
                  <div key={factor.id} className="p-4 bg-[#0D0D0D]/50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{factor.name}</h4>
                      <SeverityBadge severity={factor.severity || factor.priority} />
                    </div>
                    {factor.shortDescription && (
                      <p className="text-gray-400 text-sm mb-3">{factor.shortDescription}</p>
                    )}
                    {factor.awarenesssCue && (
                      <div className="p-3 bg-gold-500/5 rounded-lg border border-gold-500/20">
                        <p className="text-gold-400 text-sm">
                          <span className="font-medium">Awareness Cue:</span> {factor.awarenesssCue}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6 italic">No limiting factors identified</p>
              )}
            </div>
          )}
        </section>

        {/* WEEKLY REVIEW */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          <SectionHeader
            title="Weekly Review"
            icon={<Calendar className="w-5 h-5" />}
            isOpen={openSections.weekly}
            onToggle={() => toggleSection('weekly')}
            isAdmin={isAdmin}
            isEditing={editingSection === 'weekly'}
            onEdit={() => startEditing('weekly')}
            onSave={saveWeeklyReview}
            onCancel={cancelEditing}
            saving={saving}
            badge={
              weeklyReview?.shootingTrend && (
                <span className={cn(
                  'flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                  weeklyReview.shootingTrend === 'improving' ? 'bg-green-500/20 text-green-400' :
                  weeklyReview.shootingTrend === 'declining' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                )}>
                  {weeklyReview.shootingTrend === 'improving' ? <TrendingUp className="w-3 h-3" /> :
                   weeklyReview.shootingTrend === 'declining' ? <TrendingDown className="w-3 h-3" /> :
                   <Minus className="w-3 h-3" />}
                  {weeklyReview.shootingTrend}
                </span>
              )
            }
          />
          {openSections.weekly && (
            <div className="px-4 pb-4 space-y-4">
              {editingSection === 'weekly' && editingWeekly ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Summary</label>
                    <Textarea
                      value={editingWeekly.summary || ''}
                      onChange={(e) => setEditingWeekly({ ...editingWeekly, summary: e.target.value })}
                      className="bg-[#0D0D0D] border-[#2A2A2A]"
                      rows={3}
                      placeholder="Weekly summary..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Shooting Trend</label>
                    <select
                      value={editingWeekly.shootingTrend || 'stable'}
                      onChange={(e) => setEditingWeekly({ ...editingWeekly, shootingTrend: e.target.value as any })}
                      className="px-3 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white"
                    >
                      <option value="improving">Improving</option>
                      <option value="stable">Stable</option>
                      <option value="declining">Declining</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">What Changed (one per line)</label>
                    <Textarea
                      value={(editingWeekly.whatChanged || []).join('\n')}
                      onChange={(e) => setEditingWeekly({ ...editingWeekly, whatChanged: e.target.value.split('\n').filter(Boolean) })}
                      className="bg-[#0D0D0D] border-[#2A2A2A]"
                      rows={3}
                      placeholder="Enter each change on a new line..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Priorities (one per line)</label>
                    <Textarea
                      value={(editingWeekly.priorities || []).join('\n')}
                      onChange={(e) => setEditingWeekly({ ...editingWeekly, priorities: e.target.value.split('\n').filter(Boolean) })}
                      className="bg-[#0D0D0D] border-[#2A2A2A]"
                      rows={3}
                      placeholder="Enter each priority on a new line..."
                    />
                  </div>
                </>
              ) : weeklyReview ? (
                <>
                  {weeklyReview.summary && (
                    <p className="text-gray-300">{weeklyReview.summary}</p>
                  )}
                  {weeklyReview.whatChanged && weeklyReview.whatChanged.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">What Changed</h4>
                      <ul className="space-y-1">
                        {weeklyReview.whatChanged.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {weeklyReview.priorities && weeklyReview.priorities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Priorities</h4>
                      <ul className="space-y-1">
                        {weeklyReview.priorities.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <Target className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-6 italic">No weekly review yet</p>
              )}
            </div>
          )}
        </section>

        {/* STATS */}
        {stats && (
          <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            <SectionHeader
              title="Stats & Trends"
              icon={<BarChart3 className="w-5 h-5" />}
              isOpen={openSections.stats}
              onToggle={() => toggleSection('stats')}
            />
            {openSections.stats && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 bg-[#0D0D0D] rounded-xl text-center">
                    <p className="text-3xl font-bold text-white">{stats.rolling3Game3PT?.toFixed(1) || '-'}%</p>
                    <p className="text-sm text-gray-400">3-Game 3PT%</p>
                  </div>
                  <div className="p-4 bg-[#0D0D0D] rounded-xl text-center">
                    <p className="text-3xl font-bold text-white">{stats.rolling5Game3PT?.toFixed(1) || '-'}%</p>
                    <p className="text-sm text-gray-400">5-Game 3PT%</p>
                  </div>
                  <div className="p-4 bg-[#0D0D0D] rounded-xl text-center">
                    <p className="text-3xl font-bold text-white">{stats.avgShotVolume?.toFixed(1) || '-'}</p>
                    <p className="text-sm text-gray-400">Avg 3PA/Game</p>
                  </div>
                  <div className="p-4 bg-[#0D0D0D] rounded-xl text-center">
                    <div className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium mb-1',
                      stats.currentStreak === 'hot' ? 'bg-orange-500/20 text-orange-400' :
                      stats.currentStreak === 'cold' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    )}>
                      {stats.currentStreak === 'hot' ? <Flame className="w-4 h-4" /> :
                       stats.currentStreak === 'cold' ? <TrendingDown className="w-4 h-4" /> :
                       <Minus className="w-4 h-4" />}
                      {stats.streakGames > 0 ? `${stats.streakGames}G` : ''} {stats.currentStreak}
                    </div>
                    <p className="text-sm text-gray-400">Streak</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* RECENT GAMES */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          <SectionHeader
            title="Recent Games"
            icon={<Calendar className="w-5 h-5" />}
            isOpen={openSections.games}
            onToggle={() => toggleSection('games')}
            isAdmin={isAdmin}
            isEditing={editingSection === 'games'}
            onEdit={() => startEditing('games')}
            onSave={addGame}
            onCancel={cancelEditing}
            saving={saving}
            badge={<span className="text-xs text-gray-500 bg-[#2A2A2A] px-2 py-0.5 rounded-full">{recentGames.length}</span>}
          />
          {openSections.games && (
            <div className="px-4 pb-4 space-y-3">
              {/* Add Game Form (Admin Mode) */}
              {editingSection === 'games' && (
                <div className="p-4 bg-[#0D0D0D] rounded-xl border-2 border-gold-500/30 space-y-4 mb-4">
                  <h4 className="text-sm font-semibold text-gold-500">Add New Game</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Opponent</label>
                      <Input
                        value={newGame.opponent}
                        onChange={(e) => setNewGame({ ...newGame, opponent: e.target.value })}
                        placeholder="e.g., Cleveland Cavaliers"
                        className="bg-[#1A1A1A] border-[#2A2A2A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Date</label>
                      <Input
                        type="date"
                        value={newGame.gameDate}
                        onChange={(e) => setNewGame({ ...newGame, gameDate: e.target.value })}
                        className="bg-[#1A1A1A] border-[#2A2A2A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Home/Away</label>
                      <select
                        value={newGame.isHome ? 'home' : 'away'}
                        onChange={(e) => setNewGame({ ...newGame, isHome: e.target.value === 'home' })}
                        className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-white text-sm"
                      >
                        <option value="home">Home</option>
                        <option value="away">Away</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Minutes</label>
                      <Input
                        type="number"
                        value={newGame.minutesPlayed || ''}
                        onChange={(e) => setNewGame({ ...newGame, minutesPlayed: parseInt(e.target.value) || 0 })}
                        className="bg-[#1A1A1A] border-[#2A2A2A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">3PM</label>
                      <Input
                        type="number"
                        value={newGame.threePointMakes || ''}
                        onChange={(e) => setNewGame({ ...newGame, threePointMakes: parseInt(e.target.value) || 0 })}
                        className="bg-[#1A1A1A] border-[#2A2A2A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">3PA</label>
                      <Input
                        type="number"
                        value={newGame.threePointAttempts || ''}
                        onChange={(e) => setNewGame({ ...newGame, threePointAttempts: parseInt(e.target.value) || 0 })}
                        className="bg-[#1A1A1A] border-[#2A2A2A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Points</label>
                      <Input
                        type="number"
                        value={newGame.points || ''}
                        onChange={(e) => setNewGame({ ...newGame, points: parseInt(e.target.value) || 0 })}
                        className="bg-[#1A1A1A] border-[#2A2A2A]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">BB Notes</label>
                    <Textarea
                      value={newGame.bbNotes}
                      onChange={(e) => setNewGame({ ...newGame, bbNotes: e.target.value })}
                      placeholder="Game notes..."
                      className="bg-[#1A1A1A] border-[#2A2A2A]"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Hunt Next Game</label>
                    <Input
                      value={newGame.huntingNextGame}
                      onChange={(e) => setNewGame({ ...newGame, huntingNextGame: e.target.value })}
                      placeholder="What to focus on next game..."
                      className="bg-[#1A1A1A] border-[#2A2A2A]"
                    />
                  </div>
                </div>
              )}

              {/* Games List */}
              {recentGames.length > 0 ? (
                recentGames.map((game) => (
                  <div key={game.id} className="p-4 bg-[#0D0D0D]/50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-400">{game.opponent.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {game.isHome ? 'vs' : '@'} {game.opponent}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(game.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {game.minutesPlayed && ` · ${game.minutesPlayed} min`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {game.threePointMakes}/{game.threePointAttempts}
                        </p>
                        <p className="text-sm text-gray-500">
                          {game.threePointPercentage?.toFixed(0) || '-'}% 3PT
                          {game.points && ` · ${game.points} pts`}
                        </p>
                      </div>
                    </div>
                    {game.bbNotes && (
                      <div className="p-3 bg-[#1A1A1A] rounded-lg mb-2">
                        <p className="text-sm text-gray-300">{game.bbNotes}</p>
                      </div>
                    )}
                    {game.huntingNextGame && (
                      <div className="p-3 bg-gold-500/5 rounded-lg border border-gold-500/20">
                        <p className="text-sm text-gold-400">
                          <span className="font-medium">Hunt Next Game:</span> {game.huntingNextGame}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6 italic">No games tracked yet</p>
              )}
            </div>
          )}
        </section>

        {/* VIDEO LIBRARY */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          <SectionHeader
            title="Video Library"
            icon={<Video className="w-5 h-5" />}
            isOpen={openSections.videos}
            onToggle={() => toggleSection('videos')}
            isAdmin={isAdmin}
            isEditing={editingSection === 'videos'}
            onEdit={() => startEditing('videos')}
            onSave={addVideo}
            onCancel={cancelEditing}
            saving={saving}
            badge={<span className="text-xs text-gray-500 bg-[#2A2A2A] px-2 py-0.5 rounded-full">{videoLibrary.length}</span>}
          />
          {openSections.videos && (
            <div className="px-4 pb-4">
              {/* Add Video Form (Admin Mode) */}
              {editingSection === 'videos' && (
                <div className="p-4 bg-[#0D0D0D] rounded-xl border-2 border-gold-500/30 space-y-3 mb-4">
                  <h4 className="text-sm font-semibold text-gold-500">Add New Video</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Title</label>
                      <Input
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="Video title..."
                        className="bg-[#1A1A1A] border-[#2A2A2A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">URL</label>
                      <Input
                        value={newVideo.url}
                        onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="bg-[#1A1A1A] border-[#2A2A2A]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">BB Cue</label>
                    <Input
                      value={newVideo.bbCue}
                      onChange={(e) => setNewVideo({ ...newVideo, bbCue: e.target.value })}
                      placeholder="Key coaching point..."
                      className="bg-[#1A1A1A] border-[#2A2A2A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Tags (comma separated)</label>
                    <Input
                      value={newVideo.tags.join(', ')}
                      onChange={(e) => setNewVideo({ ...newVideo, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      placeholder="catch-and-shoot, training, game-clip..."
                      className="bg-[#1A1A1A] border-[#2A2A2A]"
                    />
                  </div>
                </div>
              )}

              {/* Video Grid */}
              {videoLibrary.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {videoLibrary.map((video) => (
                    <div key={video.id} className="group relative flex items-start gap-3 p-4 bg-[#0D0D0D]/50 rounded-xl hover:bg-[#0D0D0D] transition-colors">
                      {isAdmin && (
                        <button
                          onClick={() => deleteVideo(video.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      )}
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 flex-1"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#2A2A2A] flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                          <Play className="w-5 h-5 text-gray-400 group-hover:text-gold-500 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate group-hover:text-gold-500 transition-colors">
                            {video.title}
                          </h4>
                          {video.bbCue && (
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{video.bbCue}</p>
                          )}
                          {video.tags && video.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {video.tags.map((tag) => (
                                <VideoTag key={tag} tag={tag} />
                              ))}
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6 italic">No videos added yet</p>
              )}
            </div>
          )}
        </section>

        {/* COACH NOTES */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          <SectionHeader
            title="Coach Notes"
            icon={<FileText className="w-5 h-5" />}
            isOpen={openSections.notes}
            onToggle={() => toggleSection('notes')}
            isAdmin={isAdmin}
            isEditing={editingSection === 'notes'}
            onEdit={() => startEditing('notes')}
            onSave={addCoachNote}
            onCancel={cancelEditing}
            saving={saving}
            badge={<span className="text-xs text-gray-500 bg-[#2A2A2A] px-2 py-0.5 rounded-full">{coachNotes?.length || 0}</span>}
          />
          {openSections.notes && (
            <div className="px-4 pb-4 space-y-3">
              {/* Add Note Form (Admin Mode) */}
              {editingSection === 'notes' && (
                <div className="p-4 bg-[#0D0D0D] rounded-xl border-2 border-gold-500/30 space-y-3 mb-4">
                  <h4 className="text-sm font-semibold text-gold-500">Add New Note</h4>
                  <Textarea
                    value={newCoachNote}
                    onChange={(e) => setNewCoachNote(e.target.value)}
                    placeholder="Write your note..."
                    className="bg-[#1A1A1A] border-[#2A2A2A]"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">Will be attributed to: <span className="text-gold-500">{selectedCoach}</span></p>
                </div>
              )}

              {/* Notes List */}
              {coachNotes && coachNotes.length > 0 ? (
                coachNotes.map((note) => (
                  <div key={note.id} className="p-4 bg-[#0D0D0D]/50 rounded-xl">
                    <p className="text-gray-300">{note.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {note.createdBy && <span className="text-gold-500">{note.createdBy}</span>}
                      {note.createdBy && ' · '}
                      {new Date(note.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6 italic">No coach notes yet</p>
              )}
            </div>
          )}
        </section>

        {/* PLAYER CHECK-IN */}
        <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          <SectionHeader
            title="How Are You Feeling?"
            icon={<User className="w-5 h-5" />}
            isOpen={openSections.checkin}
            onToggle={() => toggleSection('checkin')}
          />
          {openSections.checkin && (
            <div className="px-4 pb-4">
              <PlayerCheckIn slug={slug} onSubmit={fetchDashboard} />
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Basketball Blueprint · Elite Performance Consulting
          </p>
        </div>
      </footer>
    </div>
  );
}

// Player Check-In Component
function PlayerCheckIn({ slug, onSubmit }: { slug: string; onSubmit: () => void }) {
  const [shotFeeling, setShotFeeling] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [energy, setEnergy] = useState(3);
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
          energyLevel: energy,
          notes: notes || undefined,
        }),
      });

      if (res.ok) {
        setShotFeeling('');
        setConfidence(3);
        setEnergy(3);
        setNotes('');
        onSubmit();
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          How does your shot feel today?
        </label>
        <Textarea
          value={shotFeeling}
          onChange={(e) => setShotFeeling(e.target.value)}
          placeholder="Describe how your shot feels..."
          className="bg-[#0D0D0D] border-[#2A2A2A]"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Confidence (1-5)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setConfidence(level)}
                className={cn(
                  'w-10 h-10 rounded-lg border transition-all font-medium',
                  confidence === level
                    ? 'bg-gold-500 border-gold-500 text-black'
                    : 'bg-[#0D0D0D] border-[#2A2A2A] text-gray-400 hover:border-gold-500/50'
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Energy (1-5)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setEnergy(level)}
                className={cn(
                  'w-10 h-10 rounded-lg border transition-all font-medium',
                  energy === level
                    ? 'bg-green-500 border-green-500 text-black'
                    : 'bg-[#0D0D0D] border-[#2A2A2A] text-gray-400 hover:border-green-500/50'
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Additional Notes (Optional)</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any other thoughts..."
          className="bg-[#0D0D0D] border-[#2A2A2A]"
          rows={2}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !shotFeeling.trim()}
        className="w-full bg-gold-500 hover:bg-gold-600 text-black font-medium"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Check-In'
        )}
      </Button>
    </form>
  );
}
