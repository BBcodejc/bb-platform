'use client';

import type { FinalNotes } from '@/types/shooting-eval';

interface FinalNotesSectionProps {
  data: Partial<FinalNotes>;
  onChange: (data: Partial<FinalNotes>) => void;
}

export function FinalNotesSection({ data, onChange }: FinalNotesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Final Notes</h2>
        <p className="text-sm text-gray-400">
          Anything else we should know about your shooting?
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Additional Notes <span className="text-xs text-gray-500">(optional)</span>
        </label>
        <textarea
          value={data.anything_else || ''}
          onChange={(e) => onChange({ anything_else: e.target.value })}
          placeholder="Any injuries, recent changes to your form, specific concerns..."
          className="w-full h-32 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 text-right">
          {data.anything_else?.length || 0}/500
        </p>
      </div>
    </div>
  );
}
