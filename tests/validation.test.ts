import { describe, it, expect } from 'vitest';
import {
  AdventureRequestSchema,
  AdventureMissionSchema,
  JournalEntrySchema,
} from '@/lib/validation/schemas';

describe('Validation Schemas', () => {
  describe('AdventureRequestSchema', () => {
    it('accepts valid input with defaults', () => {
      const parsed = AdventureRequestSchema.parse({
        durationMinutes: 30,
        category: 'walking',
      });
      expect(parsed.durationMinutes).toBe(30);
      expect(parsed.category).toBe('walking');
      expect(parsed.effort).toBe('relaxed');
      expect(parsed.group).toBe('solo');
      expect(parsed.budget).toBe('free_only');
    });

    it('rejects duration out of bounds', () => {
      expect(() => {
        AdventureRequestSchema.parse({ durationMinutes: 1 });
      }).toThrow();

      expect(() => {
        AdventureRequestSchema.parse({ durationMinutes: 500 });
      }).toThrow();
    });

    it('handles unexpected category gracefully by rejecting invalid enum', () => {
      expect(() => {
        AdventureRequestSchema.parse({ category: 'rollercoaster' });
      }).toThrow();
    });
  });

  describe('AdventureMissionSchema', () => {
    it('validates a complete mission object', () => {
      const sample = {
        id: 'test-mission-1',
        title: 'Mindful Forest Stroll',
        tagline: 'Feel the earth beneath your boots and inhale fresh pine air.',
        description: 'An unhurried walking challenge focused on tactile ground feedback and canopy sightlines.',
        durationMinutes: 15,
        category: 'walking',
        effort: 'relaxed',
        locationType: 'Local public park',
        equipment: ['Comfortable sneakers'],
        preparation: ['Put phone in pocket', 'Drink water'],
        steps: [
          {
            title: 'Initial Grounding',
            description: 'Stand still and take three diaphragmatic breaths.',
            durationMinutes: 5,
          },
          {
            title: 'Sensory Walk',
            description: 'Walk slowly and identify two distinct birds.',
            durationMinutes: 10,
          },
        ],
        observationPrompts: ['What texture did you notice underfoot?'],
        reflectionPrompt: 'Did slowing down change your pulse rate?',
        safetyNotes: ['Stay on marked trails'],
        screenFreeChallenge: 'Turn on silent mode for all 15 minutes',
        createdAt: '2026-10-11T00:00:00.000Z',
        source: 'curated_fallback',
      };

      const result = AdventureMissionSchema.safeParse(sample);
      expect(result.success).toBe(true);
    });

    it('rejects missions with fewer than 2 steps', () => {
      const sample = {
        title: 'Short',
        tagline: 'Tagline',
        description: 'Description',
        durationMinutes: 15,
        category: 'walking',
        effort: 'relaxed',
        locationType: 'Park',
        equipment: ['Shoes'],
        preparation: ['Prep'],
        steps: [
          {
            title: 'Only Step',
            description: 'Only step description',
            durationMinutes: 15,
          },
        ],
        observationPrompts: ['Prompt'],
        reflectionPrompt: 'Reflection',
        safetyNotes: ['Safety'],
        screenFreeChallenge: 'Challenge',
      };

      const result = AdventureMissionSchema.safeParse(sample);
      expect(result.success).toBe(false);
    });
  });

  describe('JournalEntrySchema', () => {
    it('validates correct journal entry', () => {
      const entry = {
        id: 'j-1',
        missionTitle: 'The 15-Minute Green Reset',
        date: '2026-10-11',
        durationMinutes: 15,
        whatINoticed: 'Rough oak bark, cool gentle autumn wind',
        feltBefore: 'Tense from debugging code',
        feltAfter: 'Relaxed shoulders and clearer thoughts',
        memorableMoment: 'A robin landed 5 feet away from the bench',
        rating: 5,
        createdAt: '2026-10-11T12:00:00Z',
      };

      const result = JournalEntrySchema.safeParse(entry);
      expect(result.success).toBe(true);
    });
  });
});
