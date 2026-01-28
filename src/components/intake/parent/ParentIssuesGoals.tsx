'use client';

import { cn } from '@/lib/utils';
import { PARENT_ISSUES, CHILD_CONFIDENCE_LEVELS, PARENT_GOALS } from '@/types';
import type { IntakeFormData, ParentIssue, ChildConfidence, ParentGoal } from '@/types';

interface ParentIssuesGoalsProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function ParentIssuesGoals({ data, onChange }: ParentIssuesGoalsProps) {
  const toggleIssue = (issue: ParentIssue) => {
    const current = data.parentIssues || [];
    if (current.includes(issue)) {
      onChange({ parentIssues: current.filter((i) => i !== issue) });
    } else if (current.length < 3) {
      onChange({ parentIssues: [...current, issue] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Issues */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What are the biggest issues you see in their game?
        </h3>
        <p className="text-sm text-gray-400 mb-4">Choose 1-3</p>
        <div className="grid gap-2">
          {PARENT_ISSUES.map((issue) => (
            <button
              key={issue.value}
              onClick={() => toggleIssue(issue.value as ParentIssue)}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.parentIssues?.includes(issue.value as ParentIssue)
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {issue.label}
            </button>
          ))}
        </div>
        {data.parentIssues?.includes('other') && (
          <textarea
            value={data.parentIssueOther || ''}
            onChange={(e) => onChange({ parentIssueOther: e.target.value })}
            placeholder="Please describe..."
            className="w-full mt-3 h-20 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
          />
        )}
      </div>

      {/* Confidence level */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How would you describe their confidence level in games?
        </h3>
        <div className="grid gap-2">
          {CHILD_CONFIDENCE_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange({ childConfidence: level.value as ChildConfidence })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.childConfidence === level.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main goal */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What&apos;s the main thing you want help with?
        </h3>
        <div className="grid gap-2">
          {PARENT_GOALS.map((goal) => (
            <button
              key={goal.value}
              onClick={() => onChange({ parentMainGoal: goal.value as ParentGoal })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.parentMainGoal === goal.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {goal.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
