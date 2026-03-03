'use client';

import { useState } from 'react';
import { Upload, Film, Trash2, Plus, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LiveVideoData, LiveVideoClip } from '@/types/coaching-client';
import { COURT_POSITION_OPTIONS, PLAY_TAG_OPTIONS } from '@/types/coaching-client';

interface LiveVideoSectionProps {
  data: Partial<LiveVideoData>;
  onChange: (data: Partial<LiveVideoData>) => void;
  clientSlug: string;
}

export function LiveVideoSection({ data, onChange, clientSlug }: LiveVideoSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState('full_court');
  const [selectedTag, setSelectedTag] = useState('general');

  const clips = data.clips || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('clientSlug', clientSlug);
        formData.append('courtPosition', selectedPosition);
        formData.append('tag', selectedTag);

        const res = await fetch('/api/upload/assessment-video', {
          method: 'POST',
          body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
          setUploadError(result.error || 'Upload failed');
          continue;
        }

        const newClip: LiveVideoClip = {
          id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url: result.url,
          court_position: selectedPosition,
          tag: selectedTag,
          uploaded_at: new Date().toISOString(),
        };

        const updatedClips = [...clips, newClip];
        onChange({
          ...data,
          clips: updatedClips,
          total_clips: updatedClips.length,
        });
      } catch (err) {
        console.error('Upload error:', err);
        setUploadError('Failed to upload video. Try again.');
      }
    }

    setIsUploading(false);
    // Reset file input
    e.target.value = '';
  };

  const removeClip = (clipId: string) => {
    const updatedClips = clips.filter((c) => c.id !== clipId);
    onChange({
      ...data,
      clips: updatedClips,
      total_clips: updatedClips.length,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Live 1v1 Video</h2>
        <p className="text-sm text-gray-400">
          Film yourself playing live 1v1 from multiple positions on the floor.
          The more clips the better — we need to see how you move, attack, and make decisions in real play.
        </p>
      </div>

      <div className="bg-bb-card border border-bb-border rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gold-500">What We Need</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>- Live 1v1 clips from different spots on the floor</li>
          <li>- Both makes and misses — we need the full picture</li>
          <li>- Side angle preferred so we can see footwork and release</li>
          <li>- At least 5-10 clips if possible</li>
        </ul>
      </div>

      {/* Clip tagging options */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Before uploading, tag your clip:
        </label>

        <div className="space-y-2">
          <p className="text-xs text-gray-500">Court Position</p>
          <div className="flex flex-wrap gap-2">
            {COURT_POSITION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedPosition(opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  selectedPosition === opt.value
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500'
                    : 'bg-bb-card text-gray-400 border border-bb-border hover:border-gold-500/50'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500">Play Type</p>
          <div className="flex flex-wrap gap-2">
            {PLAY_TAG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedTag(opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  selectedTag === opt.value
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500'
                    : 'bg-bb-card text-gray-400 border border-bb-border hover:border-blue-500/50'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div className="relative">
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
          isUploading ? 'border-gold-500/50 bg-gold-500/5' : 'border-bb-border hover:border-gold-500/50'
        )}>
          {isUploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gold-400">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Tap to upload video clips</p>
              <p className="text-xs text-gray-500 mt-1">MP4, MOV, WebM — Max 100MB per clip</p>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <p className="text-sm text-red-400">{uploadError}</p>
      )}

      {/* Uploaded clips */}
      {clips.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-gold-500" />
            Uploaded Clips ({clips.length})
          </h3>
          <div className="space-y-2">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="flex items-center justify-between bg-bb-card border border-bb-border rounded-lg p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Film className="w-4 h-4 text-gray-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded">
                        {COURT_POSITION_OPTIONS.find((o) => o.value === clip.court_position)?.label || clip.court_position}
                      </span>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                        {PLAY_TAG_OPTIONS.find((o) => o.value === clip.tag)?.label || clip.tag}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeClip(clip.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Drive fallback */}
      <div className="border-t border-bb-border pt-4 space-y-2">
        <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-gold-500" />
          Or paste a Google Drive folder link
          <span className="text-xs text-gray-500 font-normal">(alternative to uploading)</span>
        </label>
        <input
          type="url"
          value={data.drive_folder_url || ''}
          onChange={(e) => onChange({ ...data, drive_folder_url: e.target.value })}
          placeholder="https://drive.google.com/drive/folders/..."
          className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
        />
      </div>
    </div>
  );
}
