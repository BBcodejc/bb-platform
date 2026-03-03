'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewConceptPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    category_id: '',
    definition: '',
    short_description: '',
    execution_cues: [''],
    common_mistakes: [''],
    progression_notes: '',
    difficulty_level: '',
    tags: '',
    is_published: false,
  });

  useEffect(() => {
    fetch('/api/concepts/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCategories(data.categories || []);
      })
      .catch(console.error);
  }, []);

  const updateCue = (index: number, value: string) => {
    const cues = [...form.execution_cues];
    cues[index] = value;
    setForm({ ...form, execution_cues: cues });
  };

  const addCue = () => setForm({ ...form, execution_cues: [...form.execution_cues, ''] });
  const removeCue = (index: number) => {
    const cues = form.execution_cues.filter((_, i) => i !== index);
    setForm({ ...form, execution_cues: cues.length ? cues : [''] });
  };

  const updateMistake = (index: number, value: string) => {
    const mistakes = [...form.common_mistakes];
    mistakes[index] = value;
    setForm({ ...form, common_mistakes: mistakes });
  };

  const addMistake = () => setForm({ ...form, common_mistakes: [...form.common_mistakes, ''] });
  const removeMistake = (index: number) => {
    const mistakes = form.common_mistakes.filter((_, i) => i !== index);
    setForm({ ...form, common_mistakes: mistakes.length ? mistakes : [''] });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category_id || !form.definition) {
      setError('Name, category, and definition are required.');
      return;
    }

    setIsSaving(true);
    setError('');

    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    try {
      const res = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug,
          execution_cues: form.execution_cues.filter((c) => c.trim()),
          common_mistakes: form.common_mistakes.filter((m) => m.trim()),
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          difficulty_level: form.difficulty_level || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/concepts');
      } else {
        setError(data.error || 'Failed to create concept');
      }
    } catch (err) {
      setError('Network error');
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-bb-black p-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin/concepts"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Concepts
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">New Concept</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ball Height"
                className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Category *</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white focus:outline-none focus:border-gold-500"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Short Description</label>
            <input
              type="text"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              placeholder="One-liner summary"
              className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Definition */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Definition *</label>
            <textarea
              value={form.definition}
              onChange={(e) => setForm({ ...form, definition: e.target.value })}
              placeholder="Full definition of the concept..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          {/* Execution Cues */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Execution Cues</label>
            <div className="space-y-2">
              {form.execution_cues.map((cue, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={cue}
                    onChange={(e) => updateCue(i, e.target.value)}
                    placeholder={`Cue ${i + 1}`}
                    className="flex-1 h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
                  />
                  <button
                    onClick={() => removeCue(i)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addCue}
                className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add cue
              </button>
            </div>
          </div>

          {/* Common Mistakes */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Common Mistakes</label>
            <div className="space-y-2">
              {form.common_mistakes.map((mistake, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={mistake}
                    onChange={(e) => updateMistake(i, e.target.value)}
                    placeholder={`Mistake ${i + 1}`}
                    className="flex-1 h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
                  />
                  <button
                    onClick={() => removeMistake(i)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addMistake}
                className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add mistake
              </button>
            </div>
          </div>

          {/* Progression Notes */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Progression Notes</label>
            <textarea
              value={form.progression_notes}
              onChange={(e) => setForm({ ...form, progression_notes: e.target.value })}
              placeholder="How to progress this skill..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          {/* Difficulty + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Difficulty Level</label>
              <select
                value={form.difficulty_level}
                onChange={(e) => setForm({ ...form, difficulty_level: e.target.value })}
                className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white focus:outline-none focus:border-gold-500"
              >
                <option value="">No level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="elite">Elite</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="handle, control, ball"
                className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Publish toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="w-4 h-4 rounded border-bb-border bg-bb-dark text-gold-500 focus:ring-gold-500"
            />
            <span className="text-sm text-gray-300">Publish immediately</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-bb-border">
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Creating...' : 'Create Concept'}
            </Button>
            <Link href="/admin/concepts">
              <Button variant="ghost">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
