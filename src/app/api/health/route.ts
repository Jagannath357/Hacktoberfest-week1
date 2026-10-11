import { NextResponse } from 'next/server';

export async function GET() {
  const hasApiKey = Boolean(process.env.GOOGLE_AI_API_KEY && process.env.GOOGLE_AI_API_KEY.trim().length > 0);
  const modelName = process.env.AI_MODEL || 'gemma-2-9b-it';
  const provider = process.env.AI_PROVIDER || 'google';

  return NextResponse.json({
    status: 'healthy',
    application: 'TerraQuest AI',
    version: '1.0.0',
    aiConfig: {
      provider,
      model: modelName,
      apiKeyConfigured: hasApiKey,
      fallbackEngine: 'TerraQuest Curated Activity Engine (Ready)',
    },
    timestamp: new Date().toISOString(),
  });
}
