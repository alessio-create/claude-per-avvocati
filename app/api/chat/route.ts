import Anthropic from '@anthropic-ai/sdk';
import { CHATBOT_SYSTEM_PROMPT } from '../../../lib/chatbot-knowledge';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

const MAX_TOKENS = 600;
const MAX_HISTORY = 20; // keep last N turns to avoid runaway context

// Model + endpoint are auto-selected from the key prefix.
// OpenRouter keys are `sk-or-…` and need a different baseURL + model slug.
// Direct Anthropic keys (`sk-ant-…`) use the SDK defaults.
function resolveProvider(apiKey: string): { baseURL?: string; model: string } {
  if (apiKey.startsWith('sk-or-')) {
    return {
      baseURL: 'https://openrouter.ai/api/v1',
      model: 'anthropic/claude-haiku-4.5',
    };
  }
  return { model: 'claude-haiku-4-5-20251001' };
}

function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is ChatMessage =>
        m &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }));
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          'Il chatbot non è configurato sul server (manca ANTHROPIC_API_KEY). Scrivici a fatture@claudeperavvocati.it.',
      },
      { status: 503 },
    );
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return Response.json({ error: 'Body JSON non valido.' }, { status: 400 });
  }

  const messages = sanitizeMessages(body.messages);
  if (messages.length === 0) {
    return Response.json({ error: 'Nessun messaggio da elaborare.' }, { status: 400 });
  }

  const { baseURL, model } = resolveProvider(apiKey);
  const anthropic = new Anthropic({ apiKey, ...(baseURL ? { baseURL } : {}) });

  // Stream tokens back to the client as plain text (newline-safe).
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.stream({
          model,
          max_tokens: MAX_TOKENS,
          system: CHATBOT_SYSTEM_PROMPT,
          messages,
        });

        for await (const event of response) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        controller.enqueue(
          encoder.encode(
            `\n\n[Errore generando la risposta: ${message}. Riprova fra qualche secondo o scrivi a fatture@claudeperavvocati.it.]`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
