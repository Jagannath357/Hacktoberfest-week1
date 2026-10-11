import { AIProvider } from './provider';
import { GoogleAIProvider } from './google-provider';
import { CuratedFallbackProvider } from './fallback-provider';

export function getAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || 'google').toLowerCase();

  switch (provider) {
    case 'fallback':
    case 'curated':
      return new CuratedFallbackProvider();
    case 'google':
    default:
      return new GoogleAIProvider();
  }
}

export * from './provider';
export * from './google-provider';
export * from './fallback-provider';
export * from './prompts';
