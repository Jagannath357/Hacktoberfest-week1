import { GoogleGenAI } from '@google/genai';
import { AIProvider, GenerationResult } from './provider';
import { AdventureMission, AdventureRequestInput } from '@/types/adventure';
import { AdventureMissionSchema } from '@/lib/validation/schemas';
import { TERRAQUEST_SYSTEM_INSTRUCTION, buildAdventurePrompt } from './prompts';
import { CuratedFallbackProvider } from './fallback-provider';

export class GoogleAIProvider implements AIProvider {
  public readonly name = 'Google';
  private fallbackProvider = new CuratedFallbackProvider();

  async generateAdventure(input: AdventureRequestInput): Promise<GenerationResult> {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    const configuredModel = process.env.AI_MODEL || 'gemma-2-9b-it';

    if (!apiKey || apiKey.trim().length === 0) {
      const fallbackResult = await this.fallbackProvider.generateAdventure(input);
      return {
        ...fallbackResult,
        notice: 'No GOOGLE_AI_API_KEY configured. Running seamlessly in offline curated fallback mode.',
      };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = buildAdventurePrompt(input);

      // Attempt generation with configured Gemma / Google model
      const response = await ai.models.generateContent({
        model: configuredModel,
        contents: prompt,
        config: {
          systemInstruction: TERRAQUEST_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      });

      const responseText = response.text?.trim() || '';
      if (!responseText) {
        throw new Error('Empty response received from AI model');
      }

      // Clean possible markdown code fences if model returned ```json ... ```
      const cleanedJson = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsedData = JSON.parse(cleanedJson);

      // Add ID, timestamp, and source
      const missionCandidate: AdventureMission = {
        id: `mission-gemma-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: parsedData.title,
        tagline: parsedData.tagline,
        description: parsedData.description,
        durationMinutes: Number(parsedData.durationMinutes) || input.durationMinutes,
        category: parsedData.category || (input.category === 'surprise_me' ? 'walking' : input.category || 'walking'),
        effort: parsedData.effort || input.effort || 'relaxed',
        locationType: parsedData.locationType || 'nearby public park or green space',
        equipment: Array.isArray(parsedData.equipment) && parsedData.equipment.length > 0
          ? parsedData.equipment
          : ['Comfortable walking shoes'],
        preparation: Array.isArray(parsedData.preparation) && parsedData.preparation.length > 0
          ? parsedData.preparation
          : ['Check weather conditions', 'Hydrate before heading out'],
        steps: Array.isArray(parsedData.steps) && parsedData.steps.length > 0
          ? parsedData.steps.map((s: { title?: string; description?: string; durationMinutes?: number }, i: number) => ({
              title: s.title || `Phase ${i + 1}`,
              description: s.description || 'Observe and explore your immediate surroundings.',
              durationMinutes: Number(s.durationMinutes) || Math.max(2, Math.round(input.durationMinutes / parsedData.steps.length)),
            }))
          : [
              {
                title: 'Outdoor Transition',
                description: 'Step outdoors, breathe deeply, and observe your surroundings.',
                durationMinutes: Math.round(input.durationMinutes / 2),
              },
              {
                title: 'Sensory Exploration',
                description: 'Explore natural textures and bird sounds in your immediate environment.',
                durationMinutes: Math.round(input.durationMinutes / 2),
              },
            ],
        observationPrompts: Array.isArray(parsedData.observationPrompts) && parsedData.observationPrompts.length > 0
          ? parsedData.observationPrompts
          : ['What did you notice when you slowed your breathing?'],
        reflectionPrompt: parsedData.reflectionPrompt || 'How did being outside alter your state of mind compared to screen time?',
        safetyNotes: Array.isArray(parsedData.safetyNotes) && parsedData.safetyNotes.length > 0
          ? parsedData.safetyNotes
          : ['Stay on marked pedestrian pathways and respect local wildlife.'],
        screenFreeChallenge: parsedData.screenFreeChallenge || 'Keep your smartphone in your pocket or backpack during this adventure.',
        createdAt: new Date().toISOString(),
        source: 'ai_gemma',
        modelUsed: configuredModel,
      };

      // Strict validation through Zod
      const validated = AdventureMissionSchema.parse(missionCandidate);

      return {
        mission: validated,
        source: 'ai_gemma',
        modelUsed: configuredModel,
        notice: `Generated live using open-weight model: ${configuredModel}`,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[TerraQuest AI] Generation error with ${configuredModel}: ${errorMsg}. Falling back to curated engine.`);

      // Gracefully fall back to deterministic curated provider
      const fallbackResult = await this.fallbackProvider.generateAdventure(input);
      let userFriendlyNotice = 'AI endpoint unavailable; generated safely with TerraQuest Curated Activity Engine.';

      if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('rate limit')) {
        userFriendlyNotice = 'Provider quota/rate limit reached. Served via TerraQuest Curated Activity Engine (100% functional).';
      } else if (errorMsg.includes('404') || errorMsg.toLowerCase().includes('not found')) {
        userFriendlyNotice = `Model "${configuredModel}" not accessible on current endpoint. Served via Curated Activity Engine.`;
      } else if (errorMsg.includes('API key') || errorMsg.includes('401') || errorMsg.includes('403')) {
        userFriendlyNotice = 'API key invalid or unauthorized. Served via Curated Activity Engine.';
      }

      return {
        ...fallbackResult,
        notice: userFriendlyNotice,
      };
    }
  }
}
