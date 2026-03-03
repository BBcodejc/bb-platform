'use client';

import Link from 'next/link';
import { Film, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConceptCardProps {
  name: string;
  slug: string;
  shortDescription?: string;
  categoryName?: string;
  categorySlug?: string;
  categoryColor?: string;
  difficultyLevel?: string;
  videoCount?: number;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-blue-500/20 text-blue-400',
  advanced: 'bg-purple-500/20 text-purple-400',
  elite: 'bg-red-500/20 text-red-400',
};

export function ConceptCard({
  name,
  slug,
  shortDescription,
  categoryName,
  categorySlug,
  categoryColor,
  difficultyLevel,
  videoCount = 0,
}: ConceptCardProps) {
  const href = categorySlug
    ? `/library/${categorySlug}/${slug}`
    : `/library/${slug}`;

  return (
    <Link
      href={href}
      className="block bg-bb-card border border-bb-border rounded-xl p-4 hover:border-gold-500/50 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0">
          <h3 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors">
            {name}
          </h3>
          {shortDescription && (
            <p className="text-xs text-gray-500 line-clamp-2">{shortDescription}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {categoryName && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: categoryColor ? `${categoryColor}20` : undefined,
                  color: categoryColor || '#d4af37',
                }}
              >
                {categoryName}
              </span>
            )}
            {difficultyLevel && (
              <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', DIFFICULTY_COLORS[difficultyLevel] || '')}>
                {difficultyLevel}
              </span>
            )}
            {videoCount > 0 && (
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <Film className="w-3 h-3" />
                {videoCount}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gold-500 transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  );
}
