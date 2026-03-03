'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { ConceptDetail } from '@/components/concepts/ConceptDetail';
import type { Concept } from '@/types/concepts';
import { cn } from '@/lib/utils';

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-blue-500/20 text-blue-400',
  advanced: 'bg-purple-500/20 text-purple-400',
  elite: 'bg-red-500/20 text-red-400',
};

export default function ConceptPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const conceptSlug = params.conceptSlug as string;
  const [concept, setConcept] = useState<Concept | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/concepts/${conceptSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const c = data.concept;
          setConcept({
            id: c.id,
            categoryId: c.category_id,
            category: c.category,
            name: c.name,
            slug: c.slug,
            definition: c.definition,
            shortDescription: c.short_description,
            executionCues: c.execution_cues || [],
            progressionNotes: c.progression_notes,
            commonMistakes: c.common_mistakes || [],
            difficultyLevel: c.difficulty_level,
            isPublished: c.is_published,
            displayOrder: c.display_order,
            tags: c.tags || [],
            videos: (c.videos || []).map((v: any) => ({
              id: v.id,
              conceptId: v.concept_id,
              title: v.title,
              url: v.url,
              thumbnailUrl: v.thumbnail_url,
              videoType: v.video_type,
              durationSeconds: v.duration_seconds,
              description: v.description,
              displayOrder: v.display_order,
              uploadedBy: v.uploaded_by,
              createdAt: v.created_at,
            })),
            createdBy: c.created_by,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [conceptSlug]);

  return (
    <main className="min-h-screen bg-bb-black">
      <BBHeader />

      <section className="pt-24 pb-4 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/library/${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {concept?.category?.name || 'Category'}
          </Link>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : !concept ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Concept not found.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">{concept.name}</h1>
              <div className="flex items-center gap-2">
                {concept.category && (
                  <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: concept.category.color ? `${concept.category.color}20` : undefined,
                      color: concept.category.color || '#d4af37',
                    }}
                  >
                    {concept.category.name}
                  </span>
                )}
                {concept.difficultyLevel && (
                  <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full', DIFFICULTY_COLORS[concept.difficultyLevel] || '')}>
                    {concept.difficultyLevel}
                  </span>
                )}
              </div>
            </div>

            <ConceptDetail concept={concept} />
          </>
        )}
      </section>

      <BBFooter />
    </main>
  );
}
