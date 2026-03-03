// ============================================
// DEFINITIONS & CONCEPTS LIBRARY TYPES
// ============================================

export interface ConceptCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  icon?: string;
  color?: string;
  parentId?: string;
  subcategories?: ConceptCategory[];
  conceptCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Concept {
  id: string;
  categoryId: string;
  category?: ConceptCategory;
  name: string;
  slug: string;
  definition: string;
  shortDescription?: string;
  executionCues: string[];
  progressionNotes?: string;
  commonMistakes: string[];
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  isPublished: boolean;
  displayOrder: number;
  tags: string[];
  videos?: ConceptVideo[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConceptVideo {
  id: string;
  conceptId: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  videoType: 'demo' | 'nba_reference' | 'coach_breakdown' | 'player_example' | 'drill';
  durationSeconds?: number;
  description?: string;
  displayOrder: number;
  uploadedBy?: string;
  createdAt: string;
}

export type ConceptCategorySlug =
  | 'ball-manipulation'
  | 'deception'
  | 'movement-patterns'
  | 'movement-progressions'
  | 'hip-mobility'
  | 'strength-explosiveness'
  | 'shooting-calibration'
  | 'live-play-formats';

export const VIDEO_TYPE_OPTIONS = [
  { value: 'demo', label: 'Demo' },
  { value: 'nba_reference', label: 'NBA Reference' },
  { value: 'coach_breakdown', label: 'Coach Breakdown' },
  { value: 'player_example', label: 'Player Example' },
  { value: 'drill', label: 'Drill' },
];

export const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Elite' },
];
