'use client';

import { cn } from '@/lib/utils';
import { ORG_TIMELINES, ORG_BUDGETS } from '@/types';
import type { IntakeFormData, OrgTimeline as OrgTimelineType, OrgBudget } from '@/types';

interface OrgTimelineProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function OrgTimeline({ data, onChange }: OrgTimelineProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What&apos;s your decision-making timeline?
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {ORG_TIMELINES.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ orgTimeline: option.value as OrgTimelineType })}
              className={cn(
                'text-center px-4 py-4 rounded-lg border transition-all',
                data.orgTimeline === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decision makers */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Who would be involved in this decision?
        </h3>
        <textarea
          value={data.orgDecisionMakers || ''}
          onChange={(e) => onChange({ orgDecisionMakers: e.target.value })}
          placeholder="e.g., Head Coach, Athletic Director, Owner..."
          className="w-full h-20 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
        />
      </div>

      {/* Budget */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Roughly how much are you willing to invest if the results + process make sense?
        </h3>
        <div className="grid gap-2">
          {ORG_BUDGETS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ orgBudget: option.value as OrgBudget })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.orgBudget === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
