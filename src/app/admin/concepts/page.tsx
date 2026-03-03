'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Search, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConceptRow {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  difficulty_level?: string;
  is_published: boolean;
  display_order: number;
  category?: { name: string; slug: string; color?: string };
  videoCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  conceptCount: number;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-blue-500/20 text-blue-400',
  advanced: 'bg-purple-500/20 text-purple-400',
  elite: 'bg-red-500/20 text-red-400',
};

export default function AdminConceptsPage() {
  const [concepts, setConcepts] = useState<ConceptRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/concepts?published=all').then((r) => r.json()),
      fetch('/api/concepts/categories').then((r) => r.json()),
    ])
      .then(([conceptsData, categoriesData]) => {
        if (conceptsData.success) setConcepts(conceptsData.concepts || []);
        if (categoriesData.success) setCategories(categoriesData.categories || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const togglePublished = async (concept: ConceptRow) => {
    setTogglingId(concept.id);
    try {
      const res = await fetch(`/api/concepts/${concept.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !concept.is_published }),
      });
      const data = await res.json();
      if (data.success) {
        setConcepts((prev) =>
          prev.map((c) => (c.id === concept.id ? { ...c, is_published: !c.is_published } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
    setTogglingId(null);
  };

  const filtered = concepts.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || c.category?.slug === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-bb-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin" className="text-xs text-gray-500 hover:text-gold-500">Admin</Link>
              <span className="text-xs text-gray-600">/</span>
              <span className="text-xs text-gold-500">Concepts</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-gold-500" />
              Concepts Library
            </h1>
          </div>
          <Link href="/admin/concepts/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Concept
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-10 px-4 rounded-lg border border-bb-border bg-bb-card text-white focus:outline-none focus:border-gold-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name} ({cat.conceptCount})
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-bb-card border border-bb-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{concepts.length}</p>
            <p className="text-xs text-gray-500">Total Concepts</p>
          </div>
          <div className="bg-bb-card border border-bb-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{concepts.filter((c) => c.is_published).length}</p>
            <p className="text-xs text-gray-500">Published</p>
          </div>
          <div className="bg-bb-card border border-bb-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{concepts.filter((c) => !c.is_published).length}</p>
            <p className="text-xs text-gray-500">Drafts</p>
          </div>
        </div>

        {/* Concepts List */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-bb-card border border-bb-border rounded-xl">
            <BookOpen className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              {searchQuery || filterCategory ? 'No concepts match your filters.' : 'No concepts yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((concept) => (
              <div
                key={concept.id}
                className="bg-bb-card border border-bb-border rounded-xl p-4 hover:border-bb-border/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">{concept.name}</h3>
                      {concept.category && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: concept.category.color ? `${concept.category.color}20` : '#333',
                            color: concept.category.color || '#999',
                          }}
                        >
                          {concept.category.name}
                        </span>
                      )}
                      {concept.difficulty_level && (
                        <span className={cn('text-xs px-2 py-0.5 rounded', DIFFICULTY_COLORS[concept.difficulty_level] || '')}>
                          {concept.difficulty_level}
                        </span>
                      )}
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded',
                        concept.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'
                      )}>
                        {concept.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {concept.short_description || 'No description'}
                      {concept.videoCount > 0 && ` · ${concept.videoCount} video${concept.videoCount !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => togglePublished(concept)}
                      disabled={togglingId === concept.id}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        concept.is_published
                          ? 'text-green-400 hover:bg-green-500/20'
                          : 'text-gray-500 hover:bg-gray-500/20'
                      )}
                      title={concept.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {concept.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <Link
                      href={`/admin/concepts/${concept.slug}`}
                      className="p-2 rounded-lg text-gray-400 hover:bg-bb-dark hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
