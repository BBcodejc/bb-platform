'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { ConceptCard } from '@/components/concepts/ConceptCard';

interface ConceptSummary {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  difficulty_level?: string;
  category?: { name: string; slug: string; color?: string };
  videoCount?: number;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const [concepts, setConcepts] = useState<ConceptSummary[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch category info
    fetch('/api/concepts/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const cat = data.categories.find((c: any) => c.slug === categorySlug);
          if (cat) {
            setCategoryName(cat.name);
            setCategoryDescription(cat.description || '');
          }
        }
      })
      .catch(console.error);

    // Fetch concepts for this category
    fetch(`/api/concepts?category=${categorySlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setConcepts(data.concepts);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [categorySlug]);

  return (
    <main className="min-h-screen bg-bb-black">
      <BBHeader />

      <section className="pt-24 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Library
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-gold-500" />
            <h1 className="text-2xl font-bold text-white">{categoryName || categorySlug}</h1>
          </div>
          {categoryDescription && (
            <p className="text-sm text-gray-400 mb-6">{categoryDescription}</p>
          )}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : concepts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No concepts in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {concepts.map((concept) => (
              <ConceptCard
                key={concept.id}
                name={concept.name}
                slug={concept.slug}
                shortDescription={concept.short_description}
                categoryName={concept.category?.name}
                categorySlug={categorySlug}
                categoryColor={concept.category?.color}
                difficultyLevel={concept.difficulty_level}
                videoCount={concept.videoCount}
              />
            ))}
          </div>
        )}
      </section>

      <BBFooter />
    </main>
  );
}
