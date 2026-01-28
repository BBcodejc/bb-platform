'use client';

import { cn } from '@/lib/utils';
import { ORG_PROBLEMS } from '@/types';
import type { IntakeFormData, OrgProblem } from '@/types';

interface OrgProblemsProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function OrgProblems({ data, onChange }: OrgProblemsProps) {
  const toggleProblem = (problem: OrgProblem) => {
    const current = data.orgProblems || [];
    if (current.includes(problem)) {
      onChange({ orgProblems: current.filter((p) => p !== problem) });
    } else if (current.length < 3) {
      onChange({ orgProblems: [...current, problem] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Performance problems */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What are the biggest performance problems you&apos;re trying to solve?
        </h3>
        <p className="text-sm text-gray-400 mb-4">Choose 1-3</p>
        <div className="grid gap-2">
          {ORG_PROBLEMS.map((problem) => (
            <button
              key={problem.value}
              onClick={() => toggleProblem(problem.value as OrgProblem)}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.orgProblems?.includes(problem.value as OrgProblem)
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {problem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current dev model */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What&apos;s your current player development model?
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Describe how you run skill work: who leads it, how often, and what it typically looks like.
        </p>
        <textarea
          value={data.currentDevModel || ''}
          onChange={(e) => onChange({ currentDevModel: e.target.value })}
          placeholder="Describe your current development model..."
          className="w-full h-28 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
        />
      </div>

      {/* Win definition */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What would a &quot;win&quot; look like 6-12 months from now with BB support?
        </h3>
        <textarea
          value={data.orgWin || ''}
          onChange={(e) => onChange({ orgWin: e.target.value })}
          placeholder="Describe what success looks like..."
          className="w-full h-24 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
        />
      </div>
    </div>
  );
}
