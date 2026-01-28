'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IntakeFormData, Role } from '@/types';

interface IntakeFormState extends IntakeFormData {
  currentStep: number;
  setField: <K extends keyof IntakeFormData>(key: K, value: IntakeFormData[K]) => void;
  setFields: (fields: Partial<IntakeFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

const initialState: IntakeFormData = {
  role: 'player' as Role,
  email: '',
  firstName: '',
  lastName: '',
};

export const useIntakeForm = create<IntakeFormState>()(
  persist(
    (set) => ({
      ...initialState,
      currentStep: 0,

      setField: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),

      setFields: (fields) =>
        set((state) => ({
          ...state,
          ...fields,
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: state.currentStep + 1,
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),

      goToStep: (step) =>
        set({
          currentStep: step,
        }),

      reset: () =>
        set({
          ...initialState,
          currentStep: 0,
        }),
    }),
    {
      name: 'bb-intake-form',
      partialize: (state) => ({
        ...state,
        // Exclude step from persistence
        currentStep: 0,
      }),
    }
  )
);

// Helper to get steps based on role
export function getStepsForRole(role: Role) {
  const baseSteps = [
    { id: 'role', title: 'Who Are You' },
  ];

  if (role === 'player') {
    return [
      ...baseSteps,
      { id: 'level', title: 'Level & Goals' },
      { id: 'shot_feel', title: 'Shot Feel' },
      { id: 'problems', title: 'Problems' },
      { id: 'training', title: 'Training' },
      { id: 'looking_for', title: 'What You Need' },
      { id: 'contact', title: 'Contact' },
    ];
  }

  if (role === 'parent') {
    return [
      ...baseSteps,
      { id: 'child_info', title: 'About Your Child' },
      { id: 'issues', title: 'Issues & Goals' },
      { id: 'experience', title: 'Experience' },
      { id: 'interest', title: 'Interest' },
      { id: 'contact', title: 'Contact' },
    ];
  }

  if (role === 'coach') {
    return [
      ...baseSteps,
      { id: 'coaching_info', title: 'Coaching Info' },
      { id: 'player_issues', title: 'Player Issues' },
      { id: 'methods', title: 'Methods' },
      { id: 'looking_for', title: 'What You Need' },
      { id: 'contact', title: 'Contact' },
    ];
  }

  if (role === 'organization') {
    return [
      ...baseSteps,
      { id: 'org_info', title: 'Organization' },
      { id: 'problems', title: 'Problems' },
      { id: 'support', title: 'Support Needed' },
      { id: 'timeline', title: 'Timeline' },
      { id: 'contact', title: 'Contact' },
    ];
  }

  return baseSteps;
}

// Validation helpers
export function validateStep(step: number, role: Role, data: IntakeFormData): string[] {
  const errors: string[] = [];

  switch (step) {
    case 0: // Role selection
      if (!data.role) errors.push('Please select who you are');
      break;
  }

  // Final step validation (contact info) - shared across all roles
  const steps = getStepsForRole(role);
  if (step === steps.length - 1) {
    if (!data.firstName?.trim()) errors.push('First name is required');
    if (!data.lastName?.trim()) errors.push('Last name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email');
    }
  }

  return errors;
}

// Routing logic based on form data
export function getRoutingRecommendation(data: IntakeFormData): string {
  const { role } = data;

  if (role === 'player') {
    // Player routing
    if (data.playerLookingFor === 'self_paced_system' &&
        (data.playerMainGoal?.includes('spot_up_3pt') || data.playerMainGoal?.includes('off_dribble'))) {
      return 'shooting_masterclass';
    }
    if (data.playerLookingFor === 'personal_evaluation' || data.playerLookingFor === 'not_sure') {
      return 'bb_lens_assessment';
    }
    if (data.playerLookingFor === 'full_game_audit' && data.investmentLevel === 'premium') {
      return 'high_ticket_mentorship';
    }
    return 'bb_lens_assessment';
  }

  if (role === 'parent') {
    // Parent routing
    if (data.parentInterest === 'done_for_you') {
      return 'shooting_masterclass';
    }
    if (data.parentInterest === 'personal_evaluation') {
      return 'bb_lens_assessment';
    }
    if (data.parentInterest === 'high_touch_mentorship' && data.parentInvestmentLevel === 'premium') {
      return 'high_ticket_mentorship';
    }
    return 'bb_lens_assessment';
  }

  if (role === 'coach') {
    // Coach routing
    if (data.coachLookingFor === 'masterclass' || data.coachNextStep === 'on_demand_education') {
      return 'coach_masterclass';
    }
    if (data.coachLookingFor === 'consulting' || data.coachNextStep === 'bb_lens_assessment' ||
        data.coachNextStep === 'live_consultation') {
      return 'coach_consultation';
    }
    return 'coach_masterclass';
  }

  if (role === 'organization') {
    // Organization routing
    if (data.orgSupport === 'full_audit' || data.orgSupport === 'ongoing_consulting') {
      return 'org_audit_consulting';
    }
    if (data.orgSupport === 'coach_education') {
      return 'org_coach_education';
    }
    return 'org_consultation';
  }

  return 'general_inquiry';
}
