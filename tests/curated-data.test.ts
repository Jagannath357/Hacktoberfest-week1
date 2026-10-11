import { describe, it, expect } from 'vitest';
import { CURATED_MISSIONS } from '@/data/curated-missions';

describe('Curated Missions Data Integrity', () => {
  it('contains at least 6 high quality missions', () => {
    expect(CURATED_MISSIONS.length).toBeGreaterThanOrEqual(6);
  });

  it('every curated mission has required structured fields and realistic durations', () => {
    for (const mission of CURATED_MISSIONS) {
      expect(mission.id).toBeDefined();
      expect(mission.title.length).toBeGreaterThan(5);
      expect(mission.tagline.length).toBeGreaterThan(10);
      expect(mission.description.length).toBeGreaterThan(20);
      expect(mission.durationMinutes).toBeGreaterThanOrEqual(10);
      expect(mission.steps.length).toBeGreaterThanOrEqual(2);
      expect(mission.equipment.length).toBeGreaterThanOrEqual(1);
      expect(mission.preparation.length).toBeGreaterThanOrEqual(1);
      expect(mission.safetyNotes.length).toBeGreaterThanOrEqual(1);
      expect(mission.screenFreeChallenge.length).toBeGreaterThan(10);
      expect(mission.reflectionPrompt.length).toBeGreaterThan(10);

      // Verify sum of step durations matches total mission duration
      const totalSteps = mission.steps.reduce((sum, s) => sum + s.durationMinutes, 0);
      expect(totalSteps).toBe(mission.durationMinutes);
    }
  });

  it('covers multiple distinct categories', () => {
    const categories = new Set(CURATED_MISSIONS.map((m) => m.category));
    expect(categories.has('walking')).toBe(true);
    expect(categories.has('birdwatching')).toBe(true);
    expect(categories.has('gardening')).toBe(true);
    expect(categories.has('nature_photography')).toBe(true);
    expect(categories.has('mindful_observation')).toBe(true);
  });
});
