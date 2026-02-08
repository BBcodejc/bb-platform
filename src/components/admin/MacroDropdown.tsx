'use client';

import { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type BBMacro,
  type MacroVariables,
  getMacrosForField,
  renderTemplate,
} from '@/lib/bbMacros';

interface MacroDropdownProps {
  field: BBMacro['field'];
  variables: MacroVariables;
  onSelect: (text: string) => void;
  className?: string;
}

export function MacroDropdown({ field, variables, onSelect, className }: MacroDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const macros = getMacrosForField(field);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (macro: BBMacro) => {
    const renderedText = renderTemplate(macro.templateString, variables);
    onSelect(renderedText);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
          'bg-gold-500/10 text-gold-500 hover:bg-gold-500/20 border border-gold-500/30',
          isOpen && 'bg-gold-500/20'
        )}
      >
        <FileText className="w-3.5 h-3.5" />
        Templates
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-bb-dark border border-bb-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-bb-border">
            <p className="text-xs text-gray-500">Click to insert template</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {macros.map((macro) => (
              <button
                key={macro.id}
                type="button"
                onClick={() => handleSelect(macro)}
                className="w-full text-left px-3 py-2.5 hover:bg-bb-card transition-colors border-b border-bb-border/50 last:border-0"
              >
                <p className="text-sm font-medium text-white">{macro.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {macro.tags.includes('default') && '⭐ '}
                  {macro.templateString.substring(0, 60)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface GenerateAllButtonProps {
  variables: MacroVariables;
  onGenerate: (results: {
    missProfile: string;
    deepDistance: string;
    backRim: string;
    ballFlight: string;
  }) => void;
  className?: string;
}

export function GenerateAllButton({ variables, onGenerate, className }: GenerateAllButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    // Import and use the function
    import('@/lib/bbMacros').then(({ generateAllDiagnoses }) => {
      const results = generateAllDiagnoses(variables);
      onGenerate(results);
      setIsGenerating(false);
    });
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={isGenerating}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
        'bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-400 hover:to-gold-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <Sparkles className={cn('w-4 h-4', isGenerating && 'animate-spin')} />
      {isGenerating ? 'Generating...' : 'Auto-Generate All Diagnoses'}
    </button>
  );
}
