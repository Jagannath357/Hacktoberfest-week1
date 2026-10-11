import { AIProvider, GenerationResult } from './provider';
import { AdventureMission, AdventureRequestInput } from '@/types/adventure';
import { CURATED_MISSIONS } from '@/data/curated-missions';

export class CuratedFallbackProvider implements AIProvider {
  public readonly name = 'CuratedFallback';

  async generateAdventure(input: AdventureRequestInput): Promise<GenerationResult> {
    const targetCategory = input.category && input.category !== 'surprise_me'
      ? input.category
      : undefined;

    // Filter by category if specified, else use all
    let candidates = CURATED_MISSIONS;
    if (targetCategory) {
      const filtered = candidates.filter((m) => m.category === targetCategory);
      if (filtered.length > 0) {
        candidates = filtered;
      }
    }

    // Try to find closest duration
    const sorted = [...candidates].sort((a, b) => {
      const diffA = Math.abs(a.durationMinutes - input.durationMinutes);
      const diffB = Math.abs(b.durationMinutes - input.durationMinutes);
      return diffA - diffB;
    });

    const baseMission = sorted[0] || CURATED_MISSIONS[0];

    // Scale step durations proportionally to match input.durationMinutes
    const requestedDuration = input.durationMinutes;
    const totalBaseStepMinutes = baseMission.steps.reduce((acc, s) => acc + s.durationMinutes, 0) || 1;
    
    let remainingMinutes = requestedDuration;
    const scaledSteps = baseMission.steps.map((step, index) => {
      if (index === baseMission.steps.length - 1) {
        // Last step takes whatever is left to sum exactly to requestedDuration
        const lastStepMins = Math.max(1, remainingMinutes);
        return {
          ...step,
          durationMinutes: lastStepMins,
        };
      }
      const proportional = Math.max(1, Math.round((step.durationMinutes / totalBaseStepMinutes) * requestedDuration));
      remainingMinutes -= proportional;
      return {
        ...step,
        durationMinutes: proportional,
      };
    });

    const customLocation = input.location && input.location.trim().length > 0
      ? `${input.location.trim()} (nearby open space, park, or trail)`
      : baseMission.locationType;

    const customSafety = [...baseMission.safetyNotes];
    if (input.accessibilityNotes && input.accessibilityNotes.trim().length > 0) {
      customSafety.unshift(`Accessibility note honored: ${input.accessibilityNotes.trim()}`);
    }

    const mission: AdventureMission = {
      ...baseMission,
      id: `mission-curated-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      durationMinutes: requestedDuration,
      effort: input.effort || baseMission.effort,
      locationType: customLocation,
      steps: scaledSteps,
      safetyNotes: customSafety,
      createdAt: new Date().toISOString(),
      source: 'curated_fallback',
      modelUsed: 'TerraQuest Curated Activity Engine v1.0',
    };

    return {
      mission,
      source: 'curated_fallback',
      modelUsed: 'TerraQuest Curated Activity Engine',
      notice: 'Generated via TerraQuest deterministic curated engine (offline-safe, zero remote API cost).',
    };
  }
}
