import { NextRequest, NextResponse } from 'next/server';
import { AdventureRequestSchema } from '@/lib/validation/schemas';
import { getAIProvider } from '@/lib/ai';

// In-memory rate limiting map: IP -> array of request timestamps (sliding 60-second window)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Check content length to protect against oversized requests
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 100_000) {
      return NextResponse.json(
        { error: 'Payload too large. Request body must be under 100KB.' },
        { status: 413 }
      );
    }

    // 2. Rate limiting check by IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          error: 'Rate limit reached. Please wait a moment before generating another adventure.',
          retryAfterSeconds: 30,
        },
        { status: 429 }
      );
    }

    // 3. Parse and validate JSON input
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload provided.' },
        { status: 400 }
      );
    }

    const parseResult = AdventureRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed for adventure request.',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const validatedInput = parseResult.data;

    // 4. Call configured AI provider
    const provider = getAIProvider();
    const result = await provider.generateAdventure(validatedInput);

    return NextResponse.json(
      {
        success: true,
        data: result.mission,
        meta: {
          source: result.source,
          model: result.modelUsed || 'default',
          notice: result.notice,
          provider: provider.name,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[API Route /api/adventures/generate] Unexpected server error:', err);
    return NextResponse.json(
      {
        error: 'An internal error occurred while generating your adventure. Please try again.',
      },
      { status: 500 }
    );
  }
}
