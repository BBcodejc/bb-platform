'use client';

import { cn } from '@/lib/utils';
import { COACH_ISSUES, COACH_SHOOTING_STYLES } from '@/types';
import type { IntakeFormData, CoachIssue, CoachShootingStyle } from '@/types';

interface CoachPlayerIssuesProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function CoachPlayerIssues({ data, onChange }: CoachPlayerIssuesProps) {
  const toggleIssue = (issue: CoachIssue) => {
    const current = data.coachIssues || [];
    if (current.includes(issue)) {
      onChange({ coachIssues: current.filter((i) => i !== issue) });
    } else if (current.length < 2) {
      onChange({ coachIssues: [...current, issue] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Player issues */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What are the 1-2 biggest issues you see with your players&apos; offense?
        </h3>
        <div className="grid gap-2">
          {COACH_ISSUES.map((issue) => (
            <button
              key={issue.value}
              onClick={() => toggleIssue(issue.value as CoachIssue)}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.coachIssues?.includes(issue.value as CoachIssue)
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {issue.label}
            </button>
          ))}
        </div>
        {data.coachIssues?.includes('other') && (
          <textarea
            value={data.coachIssueOther || ''}
            onChange={(e) => onChange({ coachIssueOther: e.target.value })}
            placeholder="Please describe..."
            className="w-full mt-3 h-20 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
          />
        )}
      </div>

      {/* Shooting structure */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How do you currently structure shooting work?
        </h3>
        <div className="grid gap-2">
          {COACH_SHOOTING_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => onChange({ coachShootingStyle: style.value as CoachShootingStyle })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.coachShootingStyle === style.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
