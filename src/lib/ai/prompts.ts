import { AdventureRequestInput } from '@/types/adventure';

export const TERRAQUEST_SYSTEM_INSTRUCTION = `You are TerraQuest, a practical outdoor activity designer. Your purpose is to help people spend more time experiencing the physical world and less time looking at screens. Create realistic, safe, accessible outdoor activities using the user's actual preferences. Return only valid JSON matching the requested schema.

CRITICAL OPERATIONAL RULES:
1. Grounded Realism: Never invent current weather, business opening hours, trail conditions, wildlife sightings, local events, or verified nearby attractions.
2. Location Boundaries: If location information is insufficient or general, recommend general activity types (e.g. "nearby community park, public green space, tree-lined sidewalk") instead of inventing a specific proprietary place or coordinates.
3. Action Over Screens: Keep instructions concise, actionable, and enjoyable. AI creates the plan; the user experiences the physical world. The mission card must be ready to use outdoors.
4. Outdoor Ethics & Safety: Encourage responsible interaction with nature (Leave No Trace principles). Do not recommend disturbing wildlife, entering restricted areas, approaching dangerous animals, consuming unidentified wild plants or mushrooms, or engaging in unsafe activities.
5. Realistic Durations: The sum of the durations of the individual steps must closely match the requested duration in minutes.
6. Return purely a valid JSON object matching the schema. Do not include markdown code block backticks if possible, or wrap only in standard JSON.`;

export function buildAdventurePrompt(input: AdventureRequestInput): string {
  const categoryStr = input.category && input.category !== 'surprise_me' ? input.category : 'any engaging outdoor activity';
  const locationStr = input.location && input.location.trim().length > 0 ? input.location.trim() : 'a local public park, sidewalk, or nearby green space';
  const effortStr = input.effort || 'relaxed';
  const groupStr = input.group || 'solo';
  const budgetStr = input.budget || 'free_only';
  const accessibilityStr = input.accessibilityNotes && input.accessibilityNotes.trim().length > 0
    ? input.accessibilityNotes.trim()
    : 'standard walking mobility, no special restrictions mentioned';

  return `Create a personalized, real-life outdoor adventure mission with the following parameters:
- Available Time: ${input.durationMinutes} minutes
- Location / Setting: ${locationStr}
- Desired Category: ${categoryStr}
- Energy / Effort Level: ${effortStr}
- Group Type: ${groupStr}
- Budget: ${budgetStr}
- Accessibility or Mobility considerations: ${accessibilityStr}

Format your response strictly as a JSON object with this exact shape:
{
  "title": "Inspiring and realistic mission title (3-8 words)",
  "tagline": "Short evocative sub-headline (10-18 words)",
  "description": "2-3 sentences explaining the purpose and sensory focus of the activity",
  "durationMinutes": ${input.durationMinutes},
  "category": "${input.category === 'surprise_me' || !input.category ? 'walking' : input.category}",
  "effort": "${effortStr}",
  "locationType": "Practical description of the outdoor setting",
  "equipment": ["Item 1", "Item 2"],
  "preparation": ["Prep step 1 (e.g. check weather, hydrate)", "Prep step 2"],
  "steps": [
    {
      "title": "Step 1 title",
      "description": "Concrete real-world action to take",
      "durationMinutes": number
    }
  ],
  "observationPrompts": [
    "Prompt 1 to notice sensory details",
    "Prompt 2"
  ],
  "reflectionPrompt": "Thoughtful post-adventure reflection question to ponder after returning",
  "safetyNotes": ["Safety reminder 1", "Safety reminder 2"],
  "screenFreeChallenge": "Specific micro-challenge to keep smartphone away during this mission"
}`;
}
