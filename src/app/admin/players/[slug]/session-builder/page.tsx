'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  Save,
  Loader2,
  Search,
  Calendar,
  Clock,
  Target,
  Dumbbell,
  Zap,
  CircleDot,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  LayoutGrid,
  MessageSquare,
  Weight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { SessionBlock, SessionDayTemplate } from '@/types/session-library';
import { BLOCK_CATEGORY_CONFIG, getMaxPhaseForBBLevel } from '@/types/session-library';

// ============================================
// SESSION BUILDER — Admin page
// Build block-based session plans for players
// ============================================

interface PlayerInfo {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  bbLevel: number;
}

const CATEGORY_ICONS: Record<string, any> = {
  shooting: Target,
  movement: Dumbbell,
  ball_manipulation: Zap,
  live_play: CircleDot,
  evaluation: ClipboardCheck,
  strength: Weight,
};

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'shooting', label: 'Shooting' },
  { value: 'movement', label: 'Movement' },
  { value: 'ball_manipulation', label: 'Ball Manip' },
  { value: 'live_play', label: 'Live Play' },
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'strength', label: 'Strength' },
];

export default function SessionBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Data state
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [allBlocks, setAllBlocks] = useState<SessionBlock[]>([]);
  const [dayTemplates, setDayTemplates] = useState<SessionDayTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Builder state — left panel
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [templateName, setTemplateName] = useState('');
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [blockNotes, setBlockNotes] = useState<Record<string, string>>({});
  const [coachingNotes, setCoachingNotes] = useState('');
  const [expandedNoteBlock, setExpandedNoteBlock] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Library filter state — right panel
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch player, blocks, and templates
  useEffect(() => {
    async function fetchData() {
      try {
        const [playerRes, blocksRes, templatesRes] = await Promise.all([
          fetch(`/api/elite-players/${slug}`),
          fetch('/api/admin/session-blocks'),
          fetch('/api/admin/session-day-templates'),
        ]);

        if (playerRes.ok) {
          const pData = await playerRes.json();
          const p = pData.player || pData;
          setPlayer({
            id: p.id,
            slug: p.slug,
            firstName: p.firstName || p.first_name,
            lastName: p.lastName || p.last_name,
            bbLevel: p.bbLevel || p.bb_level || 1,
          });
        }

        if (blocksRes.ok) {
          const bData = await blocksRes.json();
          setAllBlocks(bData.blocks || []);
        }

        if (templatesRes.ok) {
          const tData = await templatesRes.json();
          setDayTemplates(tData.templates || []);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  // Computed values
  const maxPhase = player ? getMaxPhaseForBBLevel(player.bbLevel) : 5;

  const filteredBlocks = allBlocks.filter(b => {
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    const matchesSearch = !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.blockId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalDuration = selectedBlockIds.reduce((sum, bid) => {
    const block = allBlocks.find(b => b.blockId === bid);
    return sum + (block?.durationMinutes || 0);
  }, 0);

  // Handlers
  function addBlock(blockId: string) {
    setSelectedBlockIds(prev => [...prev, blockId]);
  }

  function removeBlock(index: number) {
    setSelectedBlockIds(prev => prev.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: 'up' | 'down') {
    const newIds = [...selectedBlockIds];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newIds.length) return;
    [newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]];
    setSelectedBlockIds(newIds);
  }

  function applyTemplate(template: SessionDayTemplate) {
    setSelectedBlockIds(template.blockIds);
    setTemplateName(template.name);
    setBlockNotes(template.blockNotes || {});
    setSelectedTemplateId(template.templateId);
  }

  function clearBuilder() {
    setSelectedBlockIds([]);
    setTemplateName('');
    setBlockNotes({});
    setCoachingNotes('');
    setSelectedTemplateId(null);
  }

  async function handleSave() {
    if (!player || selectedBlockIds.length === 0) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/session-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: player.id,
          date: selectedDate,
          templateId: selectedTemplateId,
          templateName: templateName || 'Training Session',
          blockIds: selectedBlockIds,
          blockNotes,
          coachingNotes: coachingNotes || null,
          createdBy: 'Coach Jake',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push(`/admin/players/${slug}/sessions`);
      }, 1500);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-[#1A1A1A] bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/players/${slug}/sessions`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Sessions
              </Link>
              <div className="w-px h-6 bg-[#2A2A2A]" />
              <div>
                <h1 className="text-lg font-bold text-white">Session Builder</h1>
                {player && (
                  <p className="text-sm text-gray-500">
                    {player.firstName} {player.lastName} · BB Level {player.bbLevel} · Phase 1-{maxPhase}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content — Two Column Layout */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex gap-6">

          {/* ===== LEFT PANEL — Build Area (60%) ===== */}
          <div className="flex-[3] space-y-6">

            {/* Date + Session Name */}
            <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Session Name</label>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g. System Day"
                    className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                  />
                </div>
              </div>
            </div>

            {/* Template Quick Apply */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {dayTemplates.map(template => (
                  <button
                    key={template.templateId}
                    onClick={() => applyTemplate(template)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                      selectedTemplateId === template.templateId
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                        : 'border-[#2A2A2A] bg-[#111] text-gray-400 hover:border-gray-600 hover:text-white'
                    )}
                  >
                    {template.name}
                  </button>
                ))}
                {selectedBlockIds.length > 0 && (
                  <button
                    onClick={clearBuilder}
                    className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Selected Blocks List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Session Blocks ({selectedBlockIds.length})
                </label>
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {totalDuration} min total
                </span>
              </div>

              {selectedBlockIds.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-[#2A2A2A] p-8 text-center">
                  <LayoutGrid className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No blocks added yet</p>
                  <p className="text-gray-700 text-xs mt-1">Click blocks from the library or choose a template</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedBlockIds.map((blockId, index) => {
                    const block = allBlocks.find(b => b.blockId === blockId);
                    if (!block) return null;
                    const config = BLOCK_CATEGORY_CONFIG[block.category];
                    const IconComp = CATEGORY_ICONS[block.category] || Target;
                    const isNoteExpanded = expandedNoteBlock === `${index}-${blockId}`;
                    const noteKey = `${index}-${blockId}`;

                    return (
                      <div key={`${index}-${blockId}`} className="rounded-xl bg-[#111] border border-[#1A1A1A] overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3">
                          {/* Order number */}
                          <span className="text-xs text-gray-600 font-mono w-5">{index + 1}.</span>

                          {/* Category badge */}
                          <div className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', config?.bgColor)}>
                            <span className={config?.color}>{block.blockId}</span>
                          </div>

                          {/* Name + duration */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{block.name}</p>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">{block.durationDisplay}</span>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => setExpandedNoteBlock(isNoteExpanded ? null : noteKey)}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                blockNotes[blockId]
                                  ? 'text-gold-400 hover:bg-gold-500/10'
                                  : 'text-gray-600 hover:text-gray-400 hover:bg-[#1A1A1A]'
                              )}
                              title="Add note"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveBlock(index, 'up')}
                              disabled={index === 0}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-[#1A1A1A] transition-colors disabled:opacity-20"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveBlock(index, 'down')}
                              disabled={index === selectedBlockIds.length - 1}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-[#1A1A1A] transition-colors disabled:opacity-20"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeBlock(index)}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Per-block note (collapsible) */}
                        {isNoteExpanded && (
                          <div className="px-4 pb-3 pt-0 border-t border-[#1A1A1A]">
                            <Textarea
                              value={blockNotes[blockId] || ''}
                              onChange={(e) => setBlockNotes(prev => ({ ...prev, [blockId]: e.target.value }))}
                              placeholder={`Note for ${block.blockId}...`}
                              className="bg-[#0A0A0A] border-[#2A2A2A] text-white text-sm mt-2 resize-none"
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Coaching Notes */}
            <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Session Coaching Notes
              </label>
              <Textarea
                value={coachingNotes}
                onChange={(e) => setCoachingNotes(e.target.value)}
                placeholder="Overall coaching notes for this session..."
                className="bg-[#0A0A0A] border-[#2A2A2A] text-white resize-none"
                rows={3}
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSave}
                disabled={saving || selectedBlockIds.length === 0}
                className="bg-gold-500 text-black hover:bg-gold-600 px-8"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Session Plan'}
              </Button>

              {saveSuccess && (
                <span className="text-sm text-green-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved! Redirecting...
                </span>
              )}
              {saveError && (
                <span className="text-sm text-red-400">{saveError}</span>
              )}
            </div>
          </div>

          {/* ===== RIGHT PANEL — Block Library (40%) ===== */}
          <div className="flex-[2] space-y-4">
            <div className="sticky top-[73px]">
              <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] overflow-hidden">
                {/* Library Header */}
                <div className="px-5 py-4 border-b border-[#1A1A1A]">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Block Library</h2>

                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search blocks..."
                      className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold-500/40"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => setCategoryFilter(cat.value)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                          categoryFilter === cat.value
                            ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30'
                            : 'text-gray-500 border border-transparent hover:text-gray-300 hover:bg-[#1A1A1A]'
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Block List */}
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                  {filteredBlocks.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-600 text-sm">No blocks match filters</p>
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {filteredBlocks.map(block => {
                        const config = BLOCK_CATEGORY_CONFIG[block.category];
                        const IconComp = CATEGORY_ICONS[block.category] || Target;
                        const isAdded = selectedBlockIds.includes(block.blockId);
                        const isAbovePhase = block.minPhase > maxPhase;

                        return (
                          <button
                            key={block.blockId}
                            onClick={() => addBlock(block.blockId)}
                            className={cn(
                              'w-full text-left p-3 rounded-xl transition-all',
                              'hover:bg-[#1A1A1A] hover:border-gold-500/20',
                              'border border-transparent',
                              isAbovePhase && 'opacity-70'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn('p-1.5 rounded-lg border flex-shrink-0', config?.bgColor)}>
                                <IconComp className={cn('w-3.5 h-3.5', config?.color)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={cn('text-[10px] font-bold uppercase tracking-wider', config?.color)}>
                                    {block.blockId}
                                  </span>
                                  {isAdded && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-500 font-medium">
                                      ADDED
                                    </span>
                                  )}
                                  {isAbovePhase && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-medium">
                                      ADVANCED
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-white font-medium mt-0.5 truncate">{block.name}</p>
                                <div className="flex items-center gap-3 mt-1.5">
                                  <span className="text-xs text-gray-500">{block.durationDisplay}</span>
                                  <span className={cn('text-xs', isAbovePhase ? 'text-orange-400' : 'text-gray-600')}>Phase {block.minPhase}+</span>
                                </div>
                                {block.equipment.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {block.equipment.slice(0, 3).map(eq => (
                                      <span key={eq} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A1A1A] text-gray-500">
                                        {eq}
                                      </span>
                                    ))}
                                    {block.equipment.length > 3 && (
                                      <span className="text-[10px] text-gray-600">+{block.equipment.length - 3}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <Plus className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
