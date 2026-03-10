'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Footprints,
  FileText,
  Video,
  FolderOpen,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronRight,
  Play,
  Upload,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EliteLayout } from '@/components/elite/EliteLayout';
import { getCurrentUser, canEditElite, type AuthUser } from '@/lib/middleware/auth';

// ============================================
// MOVEMENT PROTOCOL — Training Materials & BB Patterns
// Restricted to logged-in elite players & admins
// ============================================

type TabType = 'protocol-files' | 'bb-patterns';

// --- Protocol Files (Google Drive links) ---
interface ProtocolFile {
  id: string;
  title: string;
  type: 'video' | 'document';
  url: string;
  order: number;
}

const PROTOCOL_FILES: ProtocolFile[] = [
  {
    id: 'mov-intro',
    title: 'Intro to Movement Protocol',
    type: 'video',
    url: 'https://drive.google.com/open?id=19vUQnROooyXKXAEnfZveoSDLulSLfWiL',
    order: 0,
  },
  {
    id: 'mov-1',
    title: '#1 - Trail Leg Grooving (Dowel)',
    type: 'video',
    url: 'https://drive.google.com/open?id=1MZkH344RLI72GSDtVa_3HpWkANFct07j',
    order: 1,
  },
  {
    id: 'mov-2',
    title: '#2 Trail Leg w/Ball + Narrow to Wide Grooving',
    type: 'video',
    url: 'https://drive.google.com/open?id=1TEBkMkvJdVf9PJCRw5wWLEbKrY_q8dH8',
    order: 2,
  },
  {
    id: 'mov-3',
    title: '#3 Delayed Acceleration',
    type: 'video',
    url: 'https://drive.google.com/open?id=1IzCQHwu0XEXPZdmgsUpcgI2WgOdSQ1p6',
    order: 3,
  },
  {
    id: 'mov-4',
    title: '#4 Movement at High Speed',
    type: 'video',
    url: 'https://drive.google.com/open?id=13zsVN45EotF4mOO4UmEM02LwC1K4MaRL',
    order: 4,
  },
  {
    id: 'mov-pdf',
    title: 'Movement Protocol.pdf',
    type: 'document',
    url: 'https://drive.google.com/open?id=1LMKW95L7bbYQszyKDbOYMqcKa9JKh1pL',
    order: 5,
  },
];

// --- BB Patterns (folder cards with video slots) ---
interface PatternVideo {
  id: string;
  label: string;
  type: 'nba-reference' | 'bb-player' | 'coach-breakdown';
  url?: string;
}

interface BBPattern {
  id: string;
  name: string;
  description: string;
  videos: PatternVideo[];
}

const BB_PATTERNS: BBPattern[] = [
  {
    id: 'abrupt-stop',
    name: 'Abrupt Stop',
    description: 'Explosive deceleration from full speed to dead stop',
    videos: [
      { id: 'abrupt-stop-nba', label: 'NBA Reference', type: 'nba-reference' },
      { id: 'abrupt-stop-bb', label: 'BB Player', type: 'bb-player' },
      { id: 'abrupt-stop-coach', label: 'Coach Jake Breakdown (Slo-Mo)', type: 'coach-breakdown' },
    ],
  },
  {
    id: 'smooth-stop',
    name: 'Smooth Stop',
    description: 'Controlled deceleration with fluid body control',
    videos: [
      { id: 'smooth-stop-nba', label: 'NBA Reference', type: 'nba-reference' },
      { id: 'smooth-stop-bb', label: 'BB Player', type: 'bb-player' },
      { id: 'smooth-stop-coach', label: 'Coach Jake Breakdown (Slo-Mo)', type: 'coach-breakdown' },
    ],
  },
  {
    id: 'delay',
    name: 'Delay',
    description: 'Intentional speed manipulation — pull then push acceleration',
    videos: [
      { id: 'delay-nba', label: 'NBA Reference', type: 'nba-reference' },
      { id: 'delay-bb', label: 'BB Player', type: 'bb-player' },
      { id: 'delay-coach', label: 'Coach Jake Breakdown (Slo-Mo)', type: 'coach-breakdown' },
    ],
  },
  {
    id: 'voiceovers-breakdown',
    name: 'Voiceovers Breakdown',
    description: 'Detailed verbal analysis and cue breakdowns',
    videos: [
      { id: 'voiceovers-nba', label: 'NBA Reference', type: 'nba-reference' },
      { id: 'voiceovers-bb', label: 'BB Player', type: 'bb-player' },
      { id: 'voiceovers-coach', label: 'Coach Jake Breakdown (Slo-Mo)', type: 'coach-breakdown' },
    ],
  },
  {
    id: 'walk-step-variation',
    name: 'Walk Step Variation',
    description: 'Tempo manipulation using walk-step entries',
    videos: [
      { id: 'walk-step-nba', label: 'NBA Reference', type: 'nba-reference' },
      { id: 'walk-step-bb', label: 'BB Player', type: 'bb-player' },
      { id: 'walk-step-coach', label: 'Coach Jake Breakdown (Slo-Mo)', type: 'coach-breakdown' },
    ],
  },
  {
    id: 'body-fake-variations',
    name: 'Body Fake Variations',
    description: 'Upper body deception to manipulate defensive reads',
    videos: [
      { id: 'body-fake-nba', label: 'NBA Reference', type: 'nba-reference' },
      { id: 'body-fake-bb', label: 'BB Player', type: 'bb-player' },
      { id: 'body-fake-coach', label: 'Coach Jake Breakdown (Slo-Mo)', type: 'coach-breakdown' },
    ],
  },
  {
    id: 'eye-gaze',
    name: 'Eye Gaze',
    description: 'Visual deception — using eye direction to manipulate defenders',
    videos: [
      { id: 'eye-gaze-nba', label: 'NBA Reference', type: 'nba-reference' },
      { id: 'eye-gaze-bb', label: 'BB Player', type: 'bb-player' },
      { id: 'eye-gaze-coach', label: 'Coach Jake Breakdown (Slo-Mo)', type: 'coach-breakdown' },
    ],
  },
  {
    id: 'narrow-to-wide',
    name: 'Narrow to Wide',
    description: 'Base width manipulation with trunk rotation integration',
    videos: [
      { id: 'narrow-to-wide-nba', label: 'NBA Reference', type: 'nba-reference' },
      { id: 'narrow-to-wide-bb', label: 'BB Player', type: 'bb-player' },
      { id: 'narrow-to-wide-coach', label: 'Coach Jake Breakdown (Slo-Mo)', type: 'coach-breakdown' },
    ],
  },
];

// --- Video type styling ---
function getVideoTypeStyle(type: PatternVideo['type']) {
  switch (type) {
    case 'nba-reference':
      return { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'NBA' };
    case 'bb-player':
      return { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'BB' };
    case 'coach-breakdown':
      return { color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/20', label: 'Coach' };
  }
}

// ============================================
// Main Component
// ============================================
function MovementProtocolContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('protocol-files');
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

  // Dual auth check — Supabase admin first, then elite token fallback
  useEffect(() => {
    async function checkAuth() {
      // First try Supabase admin auth
      const result = await getCurrentUser();
      if (result.isAuthenticated && result.user) {
        setUser(result.user);
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
      } catch {
        // ignore
      }
      // No auth — redirect to elite login
      router.push(`/elite/login?redirect=/elite/${slug}/movement-protocol`);
    }
    checkAuth();
  }, [slug, router]);

  function handleLogout() {
    fetch('/api/elite/auth', { method: 'DELETE' }).then(() => {
      router.push('/elite/login');
    });
  }

  // Loading state
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  const videoFiles = PROTOCOL_FILES.filter(f => f.type === 'video').sort((a, b) => a.order - b.order);
  const docFiles = PROTOCOL_FILES.filter(f => f.type === 'document').sort((a, b) => a.order - b.order);

  return (
    <EliteLayout user={user} onLogout={handleLogout}>
      {/* Header */}
      <div className="border-b border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link
            href={`/elite/${slug}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
              <Footprints className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Movement Protocol</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Training videos, documents & on-court movement patterns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-[#1A1A1A] sticky top-0 bg-[#0A0A0A] z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {([
              { id: 'protocol-files' as TabType, label: 'Protocol Files', icon: FileText },
              { id: 'bb-patterns' as TabType, label: 'BB Patterns', icon: FolderOpen },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

      {/* ===== TAB 1: Protocol Files ===== */}
      {activeTab === 'protocol-files' && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Restricted badge */}
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-xs text-gold-500 font-medium uppercase tracking-wider">
              Restricted — Client & Coach Access Only
            </span>
          </div>

          {/* Videos Section */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Videos
            </h2>
            <div className="space-y-3">
              {videoFiles.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-4 transition-all hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <Video className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors">
                          {file.title}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5">Google Drive Video</p>
                      </div>
                      <div className="p-2 rounded-lg text-gray-600 group-hover:text-purple-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Documents
            </h2>
            <div className="space-y-3">
              {docFiles.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="rounded-2xl bg-[#111] border border-[#1A1A1A] p-4 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors">
                          {file.title}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5">PDF Document</p>
                      </div>
                      <div className="p-2 rounded-lg text-gray-600 group-hover:text-blue-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB 2: BB Patterns ===== */}
      {activeTab === 'bb-patterns' && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Intro */}
          <div className="mb-8">
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              On-court movement patterns used in the BB system. Each folder contains an NBA player reference,
              a BB player executing the pattern, and Coach Jake&apos;s slo-mo breakdown.
            </p>
          </div>

          {/* Pattern Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BB_PATTERNS.map((pattern) => {
              const isExpanded = expandedPattern === pattern.id;
              const uploadedCount = pattern.videos.filter(v => v.url).length;
              const hasVideos = uploadedCount > 0;

              return (
                <div
                  key={pattern.id}
                  className={cn(
                    'rounded-2xl bg-[#111] border overflow-hidden transition-all',
                    isExpanded
                      ? 'border-gold-500/30 shadow-lg shadow-gold-500/5'
                      : 'border-[#1A1A1A] hover:border-gold-500/20'
                  )}
                >
                  {/* Folder Header */}
                  <button
                    onClick={() => setExpandedPattern(isExpanded ? null : pattern.id)}
                    className="w-full flex items-center gap-4 p-4 text-left"
                  >
                    <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 flex-shrink-0">
                      <FolderOpen className={cn(
                        'w-5 h-5 transition-colors',
                        isExpanded ? 'text-gold-400' : 'text-gold-500'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{pattern.name}</p>
                      <p className="text-gray-600 text-xs mt-0.5">
                        {hasVideos
                          ? `${uploadedCount}/3 videos available`
                          : 'Coming soon'
                        }
                      </p>
                    </div>
                    <div className={cn(
                      'transition-transform duration-200',
                      isExpanded && 'rotate-90'
                    )}>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </button>

                  {/* Expanded Video Slots */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2 border-t border-[#1A1A1A] pt-3">
                      {/* Pattern description */}
                      <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                        {pattern.description}
                      </p>

                      {pattern.videos.map((video) => {
                        const typeStyle = getVideoTypeStyle(video.type);
                        return (
                          <div
                            key={video.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[#0D0D0D] border border-[#1A1A1A]"
                          >
                            {/* Type badge */}
                            <div className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0',
                              video.url ? typeStyle.bg : 'bg-gray-500/10 border-gray-500/20'
                            )}>
                              {video.url ? (
                                <Play className={cn('w-3.5 h-3.5', typeStyle.color)} />
                              ) : (
                                <Upload className="w-3.5 h-3.5 text-gray-600" />
                              )}
                            </div>

                            {/* Label */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={cn(
                                  'text-sm',
                                  video.url ? 'text-gray-200' : 'text-gray-600'
                                )}>
                                  {video.label}
                                </p>
                                <span className={cn(
                                  'text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider',
                                  video.url ? typeStyle.bg + ' ' + typeStyle.color : 'bg-gray-500/10 text-gray-600'
                                )}>
                                  {typeStyle.label}
                                </span>
                              </div>
                              {!video.url && (
                                <p className="text-[11px] text-gray-700 mt-0.5">Not yet uploaded</p>
                              )}
                            </div>

                            {/* Link button */}
                            {video.url ? (
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg hover:bg-[#1A1A1A] transition-colors flex-shrink-0"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-gold-500" />
                              </a>
                            ) : (
                              <div className="w-7" /> // spacer
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </EliteLayout>
  );
}

// ============================================
// Page Export with Suspense
// ============================================
export default function MovementProtocolPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
        </div>
      }
    >
      <MovementProtocolContent />
    </Suspense>
  );
}
