'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Trash2, Upload, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VIDEO_TYPE_OPTIONS } from '@/types/concepts';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ConceptVideoRow {
  id: string;
  title: string;
  url: string;
  video_type: string;
  duration_seconds?: number;
  description?: string;
  display_order: number;
}

export default function EditConceptPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<ConceptVideoRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

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

  // New video form
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '', video_type: 'demo', description: '' });
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/concepts/${slug}`).then((r) => r.json()),
      fetch('/api/concepts/categories').then((r) => r.json()),
    ])
      .then(([conceptData, categoriesData]) => {
        if (conceptData.success) {
          const c = conceptData.concept;
          setForm({
            name: c.name || '',
            category_id: c.category_id || '',
            definition: c.definition || '',
            short_description: c.short_description || '',
            execution_cues: c.execution_cues?.length ? c.execution_cues : [''],
            common_mistakes: c.common_mistakes?.length ? c.common_mistakes : [''],
            progression_notes: c.progression_notes || '',
            difficulty_level: c.difficulty_level || '',
            tags: (c.tags || []).join(', '),
            is_published: c.is_published ?? false,
          });
          setVideos(c.videos || []);
        }
        if (categoriesData.success) setCategories(categoriesData.categories || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [slug]);

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

  const handleSave = async () => {
    if (!form.name || !form.category_id || !form.definition) {
      setError('Name, category, and definition are required.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch(`/api/concepts/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          category_id: form.category_id,
          definition: form.definition,
          short_description: form.short_description || null,
          execution_cues: form.execution_cues.filter((c) => c.trim()),
          common_mistakes: form.common_mistakes.filter((m) => m.trim()),
          progression_notes: form.progression_notes || null,
          difficulty_level: form.difficulty_level || null,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          is_published: form.is_published,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError('Network error');
    }
    setIsSaving(false);
  };

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.url) return;
    setIsUploadingVideo(true);

    try {
      // Get concept ID first
      const conceptRes = await fetch(`/api/concepts/${slug}`);
      const conceptData = await conceptRes.json();
      if (!conceptData.success) throw new Error('Concept not found');

      const res = await fetch('/api/concepts/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept_id: conceptData.concept.id,
          title: newVideo.title,
          url: newVideo.url,
          video_type: newVideo.video_type,
          description: newVideo.description || null,
          display_order: videos.length,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVideos([...videos, data.video]);
        setNewVideo({ title: '', url: '', video_type: 'demo', description: '' });
        setShowVideoForm(false);
      }
    } catch (err) {
      console.error(err);
    }
    setIsUploadingVideo(false);
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const res = await fetch(`/api/concepts/videos/${videoId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setVideos(videos.filter((v) => v.id !== videoId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bb-black flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

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

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Edit Concept</h1>
          <Link
            href={`/library/${categories.find((c) => c.id === form.category_id)?.slug || 'concept'}/${slug}`}
            target="_blank"
            className="text-xs text-gold-500 hover:text-gold-400"
          >
            View public page →
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        {saved && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-400 text-sm rounded-lg p-3 mb-6">
            Saved successfully.
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
              className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Definition */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Definition *</label>
            <textarea
              value={form.definition}
              onChange={(e) => setForm({ ...form, definition: e.target.value })}
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
                  <button onClick={() => removeCue(i)} className="p-2 text-gray-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={addCue} className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400">
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
                  <button onClick={() => removeMistake(i)} className="p-2 text-gray-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={addMistake} className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400">
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
            <span className="text-sm text-gray-300">Published</span>
          </label>

          {/* Save */}
          <div className="flex gap-3 pt-4 border-t border-bb-border">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Videos Section */}
        <div className="mt-12 pt-8 border-t border-bb-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-gold-500" />
              Videos ({videos.length})
            </h2>
            <Button onClick={() => setShowVideoForm(true)} variant="ghost" className="gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Add Video
            </Button>
          </div>

          {/* Add video form */}
          {showVideoForm && (
            <div className="bg-bb-card border border-gold-500/30 rounded-xl p-5 mb-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">Add Video</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="Video Title *"
                  className="h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
                />
                <select
                  value={newVideo.video_type}
                  onChange={(e) => setNewVideo({ ...newVideo, video_type: e.target.value })}
                  className="h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white focus:outline-none focus:border-gold-500"
                >
                  {VIDEO_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <input
                type="url"
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                placeholder="Video URL *"
                className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
              />
              <input
                type="text"
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                placeholder="Description (optional)"
                className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
              />
              <div className="flex gap-3">
                <Button onClick={handleAddVideo} disabled={isUploadingVideo || !newVideo.title || !newVideo.url}>
                  {isUploadingVideo ? 'Adding...' : 'Add Video'}
                </Button>
                <Button variant="ghost" onClick={() => setShowVideoForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Videos list */}
          {videos.length === 0 ? (
            <div className="text-center py-8 bg-bb-card border border-bb-border rounded-xl">
              <Video className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No videos added yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-bb-card border border-bb-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-white truncate">{video.title}</h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-bb-dark text-gray-400 shrink-0">
                        {VIDEO_TYPE_OPTIONS.find((o) => o.value === video.video_type)?.label || video.video_type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{video.url}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors shrink-0 ml-2"
                    title="Delete video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
