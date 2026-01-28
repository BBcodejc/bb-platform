'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer group',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-200',
          checked
            ? 'bg-gold-500 border-gold-500'
            : 'border-gray-600 group-hover:border-gold-500/50'
        )}
      >
        {checked && <Check className="h-3 w-3 text-bb-black" strokeWidth={3} />}
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-white">{label}</span>
          )}
          {description && (
            <span className="text-xs text-gray-400 mt-0.5">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}

// Multi-select checkbox group
interface CheckboxGroupProps {
  options: Array<{ value: string; label: string; description?: string }>;
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  className?: string;
}

export function CheckboxGroup({
  options,
  values,
  onChange,
  label,
  className,
}: CheckboxGroupProps) {
  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-3">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={values.includes(option.value)}
            onChange={() => toggleValue(option.value)}
            label={option.label}
            description={option.description}
          />
        ))}
      </div>
    </div>
  );
}
