'use client';

import { User, Users, Briefcase, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

interface RoleOption {
  value: Role;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const roleOptions: RoleOption[] = [
  {
    value: 'player',
    label: "I'm a Player",
    description: 'I want to improve my shot and overall game',
    icon: <User className="w-8 h-8" />,
  },
  {
    value: 'parent',
    label: "I'm a Parent",
    description: 'My child is the player who needs development',
    icon: <Users className="w-8 h-8" />,
  },
  {
    value: 'coach',
    label: "I'm a Coach/Trainer",
    description: "I want to level up my methodology",
    icon: <Briefcase className="w-8 h-8" />,
  },
  {
    value: 'organization',
    label: 'Program/Organization',
    description: 'Club, school, academy, or pro team',
    icon: <Building2 className="w-8 h-8" />,
  },
];

interface RoleSelectionProps {
  value?: Role;
  onChange: (role: Role) => void;
}

export function RoleSelection({ value, onChange }: RoleSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">
          Welcome to Basketball Biomechanics
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          We use assessment-based methods to fix shooting, movement, and decision-making
          from youth to NBA. Answer a few questions so we can point you to the right
          breakdown, plan, or consultation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {roleOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'animate-slide-up flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 text-center',
              value === option.value
                ? 'border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/20'
                : 'border-bb-border bg-bb-card hover:border-gold-500/50 hover:bg-bb-card/80'
            )}
          >
            <div
              className={cn(
                'mb-4 p-3 rounded-full transition-colors',
                value === option.value
                  ? 'bg-gold-500 text-bb-black'
                  : 'bg-bb-border text-gray-400'
              )}
            >
              {option.icon}
            </div>
            <h3
              className={cn(
                'text-lg font-semibold mb-1',
                value === option.value ? 'text-gold-400' : 'text-white'
              )}
            >
              {option.label}
            </h3>
            <p className="text-sm text-gray-400">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
