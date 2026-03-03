'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { ConceptCard } from '@/components/concepts/ConceptCard';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  conceptCount: number;
}

interface ConceptSummary {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  difficulty_level?: string;
  category?: { name: string; slug: string; color?: string };
  videoCount?: number;
}

export default function LibraryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<ConceptSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ConceptSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    fetch('/api/concepts/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  // Fetch concepts when category changes
  useEffect(() => {
    setIsLoading(true);
    const url = selectedCategory
      ? `/api/concepts?category=${selectedCategory}`
      : '/api/concepts';
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setConcepts(data.concepts);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [selectedCategory]);

  // Search with debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/concepts/search?q=${encodeURIComponent(searchQuery)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setSearchResults(data.concepts);
        })
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayConcepts = searchResults || concepts;

  return (
    <main className="min-h-screen bg-bb-black">
      <BBHeader />

      {/* Hero */}
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-500 px-4 py-1.5 rounded-full text-xs font-medium mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            BB CONCEPTS LIBRARY
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            The Language of the Game
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Every concept, movement pattern, and principle used in BB programming.
            Search, browse, and watch video breakdowns.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="px-4 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Category Nav */}
          <div className="md:w-64 shrink-0">
            <div className="md:sticky md:top-24 space-y-1">
              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  !selectedCategory
                    ? 'bg-gold-500/20 text-gold-400 font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-bb-card'
                )}
              >
                All Concepts
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.slug); setSearchQuery(''); }}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                    selectedCategory === cat.slug
                      ? 'bg-gold-500/20 text-gold-400 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-bb-card'
                  )}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-gray-600">{cat.conceptCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Concepts Grid */}
          <div className="flex-1">
            {searchQuery.length >= 2 && (
              <p className="text-xs text-gray-500 mb-3">
                {searchResults?.length || 0} results for &quot;{searchQuery}&quot;
              </p>
            )}

            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : displayConcepts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No concepts found.</p>
                <p className="text-xs text-gray-600 mt-1">
                  {searchQuery ? 'Try a different search term.' : 'Concepts will appear here once added.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {displayConcepts.map((concept) => (
                  <ConceptCard
                    key={concept.id}
                    name={concept.name}
                    slug={concept.slug}
                    shortDescription={concept.short_description}
                    categoryName={concept.category?.name}
                    categorySlug={concept.category?.slug}
                    categoryColor={concept.category?.color}
                    difficultyLevel={concept.difficulty_level}
                    videoCount={concept.videoCount}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BBFooter />
    </main>
  );
}
