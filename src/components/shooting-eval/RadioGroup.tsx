'use client';

import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  columns?: 2 | 3 | 4 | 5;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  required,
  columns = 2,
}: RadioGroupProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-gold-500 ml-1">*</span>}
      </label>
      <div className={cn('grid gap-2', gridCols[columns])}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-center',
              value === option.value
                ? 'border-gold-500 bg-gold-500/20 text-gold-400'
                : 'border-bb-border bg-bb-card text-gray-300 hover:border-gold-500/50'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
