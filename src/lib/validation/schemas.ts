import { z } from 'zod';

export const ActivityCategorySchema = z.enum([
  'walking',
  'gardening',
  'birdwatching',
  'nature_photography',
  'mindful_observation',
  'family_exploration',
  'outdoor_fitness',
  'local_discovery',
  'surprise_me',
]);

export const ConcreteCategorySchema = z.enum([
  'walking',
  'gardening',
  'birdwatching',
  'nature_photography',
  'mindful_observation',
  'family_exploration',
  'outdoor_fitness',
  'local_discovery',
]);

export const EffortLevelSchema = z.enum(['relaxed', 'moderate', 'adventurous']);
export const GroupTypeSchema = z.enum(['solo', 'friends', 'family', 'any']);
export const BudgetTypeSchema = z.enum(['free_only', 'low_cost', 'flexible']);

export const AdventureRequestSchema = z.object({
  durationMinutes: z.number().int().min(5).max(300).default(15),
  location: z.string().max(120).optional().default(''),
  category: ActivityCategorySchema.default('surprise_me'),
  effort: EffortLevelSchema.default('relaxed'),
  group: GroupTypeSchema.default('solo'),
  budget: BudgetTypeSchema.default('free_only'),
  accessibilityNotes: z.string().max(300).optional().default(''),
});

export const MissionStepSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(5).max(400),
  durationMinutes: z.number().int().min(1).max(180),
});

export const AdventureMissionSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(120),
  tagline: z.string().min(5).max(150),
  description: z.string().min(10).max(600),
  durationMinutes: z.number().int().min(5).max(300),
  category: ConcreteCategorySchema,
  effort: EffortLevelSchema,
  locationType: z.string().min(2).max(150).default('nearby outdoor space'),
  equipment: z.array(z.string().min(1).max(100)).min(1).default(['Comfortable walking shoes']),
  preparation: z.array(z.string().min(1).max(150)).min(1).default(['Check current weather', 'Bring water if warm']),
  steps: z.array(MissionStepSchema).min(2).max(8),
  observationPrompts: z.array(z.string().min(5).max(200)).min(1).max(6),
  reflectionPrompt: z.string().min(5).max(300),
  safetyNotes: z.array(z.string().min(5).max(250)).min(1).max(6),
  screenFreeChallenge: z.string().min(5).max(300),
  createdAt: z.string(),
  source: z.enum(['ai_gemma', 'curated_fallback']).default('ai_gemma'),
  modelUsed: z.string().optional(),
});

export const JournalEntrySchema = z.object({
  id: z.string().min(1),
  missionId: z.string().optional(),
  missionTitle: z.string().min(1).max(120),
  date: z.string().min(4),
  durationMinutes: z.number().min(1).max(600),
  whatINoticed: z.string().min(2).max(1500),
  feltBefore: z.string().min(1).max(300),
  feltAfter: z.string().min(1).max(300),
  memorableMoment: z.string().min(2).max(800),
  rating: z.number().min(1).max(5).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});
