'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConceptInlineRefProps {
  name: string;
  slug: string;
  categorySlug?: string;
  definition?: string;
  firstVideoUrl?: string;
}

export function ConceptInlineRef({
  name,
  slug,
  categorySlug,
  definition,
  firstVideoUrl,
}: ConceptInlineRefProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const href = categorySlug ? `/library/${categorySlug}/${slug}` : `/library/${slug}`;

  return (
    <span className="inline-block relative">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 text-xs font-medium hover:bg-gold-500/25 transition-colors cursor-pointer"
      >
        {name}
      </button>

      {isExpanded && (
        <div className="absolute z-50 left-0 top-full mt-1 w-72 bg-bb-card border border-gold-500/30 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-gold-400">{name}</h4>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {definition && (
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">{definition}</p>
          )}

          <Link
            href={href}
            className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors"
          >
            View full concept
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </span>
  );
}
