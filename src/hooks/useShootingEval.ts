'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ShootingEvalFormState } from '@/types/shooting-eval';

const STORAGE_KEY_PREFIX = 'bb-shooting-eval-';

export type EvalStep =
  | 'player_info'
  | 'fourteen_spot'
  | 'deep_distance'
  | 'back_rim'
  | 'ball_flight'
  | 'fades'
  | 'final_notes'
  | 'review';

export const EVAL_STEPS: { id: EvalStep; title: string; description: string }[] = [
  { id: 'player_info', title: 'Player Info', description: 'Basic information' },
  { id: 'fourteen_spot', title: '14-Spot Baseline', description: '3 rounds × 14 shots' },
  { id: 'deep_distance', title: 'Deep Distance', description: 'Range testing' },
  { id: 'back_rim', title: 'Back-Rim Challenge', description: 'Intentional back-rim' },
  { id: 'ball_flight', title: 'Ball Flight', description: 'Arc spectrum' },
  { id: 'fades', title: 'Fades', description: 'Directional fades' },
  { id: 'final_notes', title: 'Final Notes', description: 'Anything else' },
  { id: 'review', title: 'Review & Submit', description: 'Check your data' },
];

export function useShootingEval(prospectId: string) {
  const [currentStep, setCurrentStep] = useState<EvalStep>('player_info');
  const [formData, setFormData] = useState<ShootingEvalFormState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = `${STORAGE_KEY_PREFIX}${prospectId}`;

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || {});
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep);
        }
      } catch (e) {
        console.error('Failed to load saved evaluation:', e);
      }
    }
    setIsLoaded(true);
  }, [storageKey]);

  // Autosave to localStorage whenever formData changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify({
        formData,
        currentStep,
        lastSaved: new Date().toISOString(),
      }));
    }
  }, [formData, currentStep, storageKey, isLoaded]);

  // Update a specific section
  const updateSection = useCallback(<K extends keyof ShootingEvalFormState>(
    section: K,
    data: Partial<ShootingEvalFormState[K]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        ...data,
      },
    }));
  }, []);

  // Navigate to next step
  const nextStep = useCallback(() => {
    const currentIndex = EVAL_STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex < EVAL_STEPS.length - 1) {
      setCurrentStep(EVAL_STEPS[currentIndex + 1].id);
    }
  }, [currentStep]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    const currentIndex = EVAL_STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(EVAL_STEPS[currentIndex - 1].id);
    }
  }, [currentStep]);

  // Go to specific step
  const goToStep = useCallback((step: EvalStep) => {
    setCurrentStep(step);
  }, []);

  // Clear all saved data
  const clearData = useCallback(() => {
    localStorage.removeItem(storageKey);
    setFormData({});
    setCurrentStep('player_info');
  }, [storageKey]);

  // Check if a section is complete
  const isSectionComplete = useCallback((section: keyof ShootingEvalFormState): boolean => {
    const data = formData[section];
    if (!data) return false;

    switch (section) {
      case 'player_info':
        return !!(data as any).full_name && !!(data as any).age && !!(data as any).level && !!(data as any).dominant_hand;
      case 'fourteen_spot':
        return (data as any).round_1?.score !== undefined && (data as any).round_2?.score !== undefined && (data as any).round_3?.score !== undefined;
      case 'deep_distance':
        return (data as any).deep_distance_steps_behind_line !== undefined;
      case 'back_rim':
        return (data as any).level_1?.total_shots !== undefined;
      case 'ball_flight':
        return (data as any).flat?.makes_or_backrim_7 !== undefined && (data as any).normal?.makes_or_backrim_7 !== undefined && (data as any).high?.makes_or_backrim_7 !== undefined;
      case 'fades':
        return (data as any).fade_right?.makes_or_backrim_7 !== undefined && (data as any).fade_left?.makes_or_backrim_7 !== undefined;
      case 'final_notes':
        return true; // Optional section, always complete
      default:
        return false;
    }
  }, [formData]);

  // Get completion percentage
  const getCompletionPercentage = useCallback((): number => {
    const sections: (keyof ShootingEvalFormState)[] = [
      'player_info',
      'fourteen_spot',
      'deep_distance',
      'back_rim',
      'ball_flight',
      'fades',
    ];
    const completed = sections.filter((s) => isSectionComplete(s)).length;
    return Math.round((completed / sections.length) * 100);
  }, [isSectionComplete]);

  return {
    currentStep,
    formData,
    isLoaded,
    updateSection,
    nextStep,
    prevStep,
    goToStep,
    clearData,
    isSectionComplete,
    getCompletionPercentage,
  };
}
