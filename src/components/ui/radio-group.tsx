'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  layout?: 'vertical' | 'horizontal' | 'cards';
  className?: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  label,
  error,
  layout = 'vertical',
  className,
}: RadioGroupProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-3">
          {label}
        </label>
      )}
      <div
        className={cn({
          'space-y-2': layout === 'vertical',
          'flex flex-wrap gap-3': layout === 'horizontal',
          'grid gap-3 sm:grid-cols-2': layout === 'cards',
        })}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer transition-all duration-200',
              layout === 'cards'
                ? cn(
                    'flex-col items-center justify-center rounded-xl border-2 p-4 text-center',
                    value === option.value
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-bb-border bg-bb-card hover:border-gold-500/50'
                  )
                : cn(
                    'items-start gap-3 rounded-lg p-3',
                    value === option.value
                      ? 'bg-gold-500/10'
                      : 'hover:bg-white/5'
                  )
            )}
            onClick={() => onChange?.(option.value)}
          >
            {layout !== 'cards' && (
              <div
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                  value === option.value
                    ? 'border-gold-500'
                    : 'border-gray-600'
                )}
              >
                {value === option.value && (
                  <div className="h-2.5 w-2.5 rounded-full bg-gold-500" />
                )}
              </div>
            )}
            <div
              className={cn(
                'flex flex-col',
                layout === 'cards' && 'items-center'
              )}
            >
              {option.icon && (
                <div className="mb-2 text-gold-500">{option.icon}</div>
              )}
              <span
                className={cn(
                  'font-medium',
                  value === option.value ? 'text-gold-400' : 'text-white'
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-gray-400 mt-1">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
