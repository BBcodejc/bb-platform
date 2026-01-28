'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  label: string;
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  required?: boolean;
  helper?: string;
  showStepper?: boolean;
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  required,
  helper,
  showStepper = true,
}: NumberInputProps) {
  const handleIncrement = () => {
    const current = value ?? min;
    if (current < max) {
      onChange(current + 1);
    }
  };

  const handleDecrement = () => {
    const current = value ?? min;
    if (current > min) {
      onChange(current - 1);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-gold-500 ml-1">*</span>}
      </label>
      {helper && (
        <p className="text-xs text-gray-500">{helper}</p>
      )}
      <div className="flex items-center gap-2">
        {showStepper && (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value === undefined || value <= min}
            className={cn(
              'w-10 h-10 rounded-lg border flex items-center justify-center transition-colors',
              value === undefined || value <= min
                ? 'border-bb-border text-gray-600 cursor-not-allowed'
                : 'border-bb-border text-white hover:border-gold-500 hover:bg-gold-500/10'
            )}
          >
            <Minus className="w-4 h-4" />
          </button>
        )}
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val >= min && val <= max) {
              onChange(val);
            } else if (e.target.value === '') {
              onChange(min);
            }
          }}
          min={min}
          max={max}
          className={cn(
            'flex-1 h-10 px-4 rounded-lg border border-bb-border bg-bb-card text-white text-center font-semibold',
            'focus:outline-none focus:border-gold-500',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
          )}
        />
        {showStepper && (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={value !== undefined && value >= max}
            className={cn(
              'w-10 h-10 rounded-lg border flex items-center justify-center transition-colors',
              value !== undefined && value >= max
                ? 'border-bb-border text-gray-600 cursor-not-allowed'
                : 'border-bb-border text-white hover:border-gold-500 hover:bg-gold-500/10'
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
