'use client';

import { cn } from '@/lib/utils';
import { ORG_SUPPORTS, ORG_READINESS_LEVELS } from '@/types';
import type { IntakeFormData, OrgSupport as OrgSupportType, OrgReadiness } from '@/types';

interface OrgSupportProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function OrgSupport({ data, onChange }: OrgSupportProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Support type */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Which kind of support are you most interested in?
        </h3>
        <div className="grid gap-2">
          {ORG_SUPPORTS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ orgSupport: option.value as OrgSupportType })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.orgSupport === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Readiness */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How ready are you to implement change?
        </h3>
        <div className="grid gap-2">
          {ORG_READINESS_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange({ orgReadiness: level.value as OrgReadiness })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.orgReadiness === level.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
