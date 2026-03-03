'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Week0FormState, Week0Step } from '@/types/coaching-client';

const STORAGE_KEY_PREFIX = 'bb-week0-';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export const WEEK0_STEPS: { id: Week0Step; title: string; description: string }[] = [
  { id: 'player_info', title: 'Player Info', description: 'Basic information' },
  { id: 'fourteen_spot', title: '14-Spot Baseline', description: '3 rounds x 14 shots' },
  { id: 'deep_distance', title: 'Deep Distance', description: 'Range testing' },
  { id: 'back_rim', title: 'Back-Rim Challenge', description: 'Intentional back-rim' },
  { id: 'ball_flight', title: 'Ball Flight', description: 'Arc spectrum' },
  { id: 'fades', title: 'Fades', description: 'Directional fades' },
  { id: 'oversize_ball', title: 'Oversize Ball', description: 'Oversize vs regular' },
  { id: 'live_video', title: 'Live 1v1 Video', description: 'Film your game' },
  { id: 'vertical_jump', title: 'Vertical Jump', description: 'Explosiveness test' },
  { id: 'movement_patterns', title: 'Movement Patterns', description: 'Trail leg, stops, hips' },
  { id: 'review', title: 'Review & Submit', description: 'Check your data' },
];

export function useWeek0Assessment(clientSlug: string) {
  const [currentStep, setCurrentStep] = useState<Week0Step>('player_info');
  const [formData, setFormData] = useState<Week0FormState>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = `${STORAGE_KEY_PREFIX}${clientSlug}`;

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
        console.error('Failed to load saved assessment:', e);
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

  // Periodic server-side autosave
  useEffect(() => {
    if (!isLoaded) return;

    saveTimerRef.current = setInterval(() => {
      if (Object.keys(formData).length > 0) {
        fetch(`/api/coaching/assessment/${clientSlug}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ current_step: currentStep, ...formData }),
        }).catch((err) => console.error('Autosave failed:', err));
      }
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [isLoaded, formData, currentStep, clientSlug]);

  // Update a specific section
  const updateSection = useCallback(<K extends keyof Week0FormState>(
    section: K,
    data: Partial<NonNullable<Week0FormState[K]>>
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
    const currentIndex = WEEK0_STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex < WEEK0_STEPS.length - 1) {
      setCurrentStep(WEEK0_STEPS[currentIndex + 1].id);
    }
  }, [currentStep]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    const currentIndex = WEEK0_STEPS.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(WEEK0_STEPS[currentIndex - 1].id);
    }
  }, [currentStep]);

  // Go to specific step
  const goToStep = useCallback((step: Week0Step) => {
    setCurrentStep(step);
  }, []);

  // Clear all saved data
  const clearData = useCallback(() => {
    localStorage.removeItem(storageKey);
    setFormData({});
    setCurrentStep('player_info');
  }, [storageKey]);

  // Check if a section is complete
  const isSectionComplete = useCallback((section: keyof Week0FormState): boolean => {
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
      case 'oversize_ball':
        return (data as any).score_regular !== undefined && (data as any).score_oversize !== undefined;
      case 'live_video':
        return ((data as any).clips?.length > 0) || !!(data as any).drive_folder_url;
      case 'vertical_jump':
        return (data as any).max_vert_inches !== undefined;
      case 'movement_patterns':
        return !!(data as any).trail_leg?.rating && !!(data as any).stops?.rating && !!(data as any).hip_mobility?.rating;
      default:
        return false;
    }
  }, [formData]);

  // Get completion percentage
  const getCompletionPercentage = useCallback((): number => {
    const sections: (keyof Week0FormState)[] = [
      'player_info', 'fourteen_spot', 'deep_distance', 'back_rim',
      'ball_flight', 'fades', 'oversize_ball', 'live_video',
      'vertical_jump', 'movement_patterns',
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
