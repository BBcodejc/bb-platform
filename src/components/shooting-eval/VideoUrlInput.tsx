'use client';

import { Video, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoUrlInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function VideoUrlInput({
  label,
  value,
  onChange,
  placeholder = 'Paste Google Drive, Dropbox, or YouTube link',
}: VideoUrlInputProps) {
  const isValidUrl = value && (
    value.includes('drive.google.com') ||
    value.includes('dropbox.com') ||
    value.includes('youtube.com') ||
    value.includes('youtu.be') ||
    value.startsWith('http')
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
        <Video className="w-4 h-4 text-gold-500" />
        {label}
        <span className="text-xs text-gray-500 font-normal">(strongly recommended)</span>
      </label>
      <div className="relative">
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full h-10 px-4 pr-10 rounded-lg border bg-bb-card text-white placeholder:text-gray-500',
            'focus:outline-none focus:border-gold-500',
            isValidUrl ? 'border-green-500/50' : 'border-bb-border'
          )}
        />
        {isValidUrl && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-400"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
