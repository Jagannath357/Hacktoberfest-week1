import { describe, it, expect } from 'vitest';
import { TERRAQUEST_SYSTEM_INSTRUCTION, buildAdventurePrompt } from '@/lib/ai/prompts';

describe('Prompts and Instructions', () => {
  it('contains strict safety and grounded realism rules in system instruction', () => {
    expect(TERRAQUEST_SYSTEM_INSTRUCTION).toContain('Never invent current weather');
    expect(TERRAQUEST_SYSTEM_INSTRUCTION).toContain('Leave No Trace');
    expect(TERRAQUEST_SYSTEM_INSTRUCTION).toContain('Do not recommend disturbing wildlife');
  });

  it('builds customized prompt with user preferences', () => {
    const prompt = buildAdventurePrompt({
      durationMinutes: 25,
      category: 'nature_photography',
      effort: 'moderate',
      location: 'Botanical Gardens',
      accessibilityNotes: 'Level walking paths only',
    });

    expect(prompt).toContain('25 minutes');
    expect(prompt).toContain('nature_photography');
    expect(prompt).toContain('Botanical Gardens');
    expect(prompt).toContain('Level walking paths only');
  });
});
