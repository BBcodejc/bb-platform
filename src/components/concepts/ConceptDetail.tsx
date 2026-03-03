'use client';

import { Play, ChevronRight, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Concept, ConceptVideo } from '@/types/concepts';

interface ConceptDetailProps {
  concept: Concept;
}

function VideoCard({ video }: { video: ConceptVideo }) {
  const typeLabels: Record<string, string> = {
    demo: 'Demo',
    nba_reference: 'NBA Reference',
    coach_breakdown: 'Coach Breakdown',
    player_example: 'Player Example',
    drill: 'Drill',
  };

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-bb-dark border border-bb-border rounded-lg p-3 hover:border-gold-500/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center shrink-0">
          <Play className="w-4 h-4 text-gold-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors truncate">
            {video.title}
          </p>
          <p className="text-xs text-gray-500">
            {typeLabels[video.videoType] || video.videoType}
            {video.durationSeconds ? ` · ${Math.floor(video.durationSeconds / 60)}:${(video.durationSeconds % 60).toString().padStart(2, '0')}` : ''}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gold-500 shrink-0" />
      </div>
      {video.description && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{video.description}</p>
      )}
    </a>
  );
}

export function ConceptDetail({ concept }: ConceptDetailProps) {
  return (
    <div className="space-y-6">
      {/* Definition */}
      <div className="bg-bb-card border border-bb-border rounded-xl p-5">
        <p className="text-sm text-gray-300 leading-relaxed">
          {concept.definition}
        </p>
      </div>

      {/* Execution Cues */}
      {concept.executionCues.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-gold-500" />
            Execution Cues
          </h3>
          <div className="space-y-2">
            {concept.executionCues.map((cue, i) => (
              <div key={i} className="flex items-start gap-3 bg-bb-card border border-bb-border rounded-lg p-3">
                <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                  <span className="text-gold-500 text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-300">{cue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progression Notes */}
      {concept.progressionNotes && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            How to Progress
          </h3>
          <div className="bg-bb-card border border-green-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              {concept.progressionNotes}
            </p>
          </div>
        </div>
      )}

      {/* Common Mistakes */}
      {concept.commonMistakes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Common Mistakes
          </h3>
          <div className="space-y-2">
            {concept.commonMistakes.map((mistake, i) => (
              <div key={i} className="bg-bb-card border border-amber-500/20 rounded-lg p-3">
                <p className="text-sm text-gray-400">{mistake}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {concept.videos && concept.videos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-gold-500" />
            Video Evidence ({concept.videos.length})
          </h3>
          <div className="space-y-2">
            {concept.videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {concept.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {concept.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-gray-500 bg-bb-dark px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
