import { describe, it, expect } from 'vitest';
import { CuratedFallbackProvider } from '@/lib/ai/fallback-provider';
import { AdventureMissionSchema } from '@/lib/validation/schemas';

describe('CuratedFallbackProvider', () => {
  const provider = new CuratedFallbackProvider();

  it('generates a valid adventure mission matching requested duration', async () => {
    const result = await provider.generateAdventure({
      durationMinutes: 45,
      category: 'birdwatching',
      effort: 'relaxed',
      location: 'Central Riverside Park',
      accessibilityNotes: 'Wheelchair accessible path',
    });

    expect(result.source).toBe('curated_fallback');
    expect(result.mission.durationMinutes).toBe(45);
    expect(result.mission.category).toBe('birdwatching');
    expect(result.mission.locationType).toContain('Central Riverside Park');

    // Steps should scale and sum to requested duration (or within 1 min rounding)
    const stepSum = result.mission.steps.reduce((acc, s) => acc + s.durationMinutes, 0);
    expect(stepSum).toBe(45);

    // Verify it passes full strict Zod validation
    const parsed = AdventureMissionSchema.safeParse(result.mission);
    expect(parsed.success).toBe(true);
  });

  it('handles surprise_me category by assigning a valid concrete activity', async () => {
    const result = await provider.generateAdventure({
      durationMinutes: 20,
      category: 'surprise_me',
      effort: 'moderate',
    });

    expect(result.mission.category).toBeDefined();
    expect(result.mission.category).not.toBe('surprise_me');
    expect(result.mission.steps.length).toBeGreaterThanOrEqual(2);
  });
});
