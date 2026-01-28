'use client';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ORG_TYPES, TEAM_COUNTS } from '@/types';
import type { IntakeFormData, OrgType, TeamCount } from '@/types';

interface OrgInfoProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function OrgInfo({ data, onChange }: OrgInfoProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Org type */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What type of organization are you?
        </h3>
        <div className="grid gap-2">
          {ORG_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => onChange({ orgType: type.value as OrgType })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.orgType === type.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Org name */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Organization Name
        </h3>
        <Input
          value={data.orgName || ''}
          onChange={(e) => onChange({ orgName: e.target.value })}
          placeholder="Your organization name"
        />
      </div>

      {/* Team count */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How many teams / athletes are in your ecosystem?
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {TEAM_COUNTS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ teamCount: option.value as TeamCount })}
              className={cn(
                'text-center px-4 py-4 rounded-lg border transition-all',
                data.teamCount === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              <span className="text-lg font-semibold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
