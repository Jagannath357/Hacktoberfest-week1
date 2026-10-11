export type ActivityCategory =
  | 'walking'
  | 'gardening'
  | 'birdwatching'
  | 'nature_photography'
  | 'mindful_observation'
  | 'family_exploration'
  | 'outdoor_fitness'
  | 'local_discovery'
  | 'surprise_me';

export type EffortLevel = 'relaxed' | 'moderate' | 'adventurous';

export type GroupType = 'solo' | 'friends' | 'family' | 'any';

export type BudgetType = 'free_only' | 'low_cost' | 'flexible';

export interface MissionStep {
  title: string;
  description: string;
  durationMinutes: number;
}

export interface AdventureMission {
  id: string;
  title: string;
  tagline: string;
  description: string;
  durationMinutes: number;
  category: Exclude<ActivityCategory, 'surprise_me'>;
  effort: EffortLevel;
  locationType: string;
  equipment: string[];
  preparation: string[];
  steps: MissionStep[];
  observationPrompts: string[];
  reflectionPrompt: string;
  safetyNotes: string[];
  screenFreeChallenge: string;
  createdAt: string;
  source: 'ai_gemma' | 'curated_fallback';
  modelUsed?: string;
}

export interface AdventureRequestInput {
  durationMinutes: number;
  location?: string;
  category?: ActivityCategory;
  effort?: EffortLevel;
  group?: GroupType;
  budget?: BudgetType;
  accessibilityNotes?: string;
}

export interface UserAdventureProgress {
  missionId: string;
  mission: AdventureMission;
  status: 'saved' | 'in_progress' | 'completed';
  currentStepIndex: number;
  startedAt?: string;
  completedAt?: string;
  timeSpentMinutes?: number;
  savedAt: string;
  journalEntryId?: string;
}

export interface JournalEntry {
  id: string;
  missionId?: string;
  missionTitle: string;
  date: string;
  durationMinutes: number;
  whatINoticed: string;
  feltBefore: string;
  feltAfter: string;
  memorableMoment: string;
  rating?: number; // 1-5 stars
  createdAt: string;
  updatedAt?: string;
}

export interface AdventureStats {
  totalMinutes: number;
  completedCount: number;
  savedCount: number;
  journalCount: number;
  categoryCounts: Record<string, number>;
}
