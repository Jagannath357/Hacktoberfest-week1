import { AdventureMission, AdventureRequestInput } from '@/types/adventure';

export interface GenerationResult {
  mission: AdventureMission;
  source: 'ai_gemma' | 'curated_fallback';
  modelUsed?: string;
  notice?: string;
}

export interface AIProvider {
  name: string;
  generateAdventure(input: AdventureRequestInput): Promise<GenerationResult>;
}
