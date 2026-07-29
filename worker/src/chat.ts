import type { ChatMessage } from './guard';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MAX_OUTPUT_TOKENS = 350;

interface GroqStreamChunk {
  choices?: Array<{ delta?: { content?: string } }>;
}

function sse(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

/**
 * Stream a Sancho reply. Emits our own minimal SSE protocol:
 *   data: {"delta":"..."}   — text fragment
 *   data: {"error":"..."}   — terminal error
 *   data: [DONE]            — end of stream
 *
 * Every fragment passes through a canary scan on the accumulated text.
 * If the secret canary (or a system-prompt marker) appears, the stream is
 * killed immediately — the model is leaking its instructions.
 */
export async function streamChat(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: ChatMessage[],
  canary: string,
): Promise<Response> {
  const upstream = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.6,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    console.log(JSON.stringify({ event: 'groq_error', status: upstream.status }));
    return Response.json({ error: 'upstream_error' }, { status: 502 });
  }

  // Leak markers: the canary secret plus distinctive substrings of the prompt scaffold.
  const leakMarkers = [canary, '[CANARY:', 'Hard rules (never break', 'untrusted input protocol'];

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = '';
      let accumulated = '';
      let leaked = false;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === '[DONE]') continue;
            let delta = '';
            try {
              const parsed = JSON.parse(payload) as GroqStreamChunk;
              delta = parsed.choices?.[0]?.delta?.content ?? '';
            } catch {
              continue;
            }
            if (!delta) continue;
            accumulated += delta;
            if (leakMarkers.some((m) => accumulated.includes(m))) {
              leaked = true;
              break;
            }
            controller.enqueue(encoder.encode(sse({ delta })));
          }
          if (leaked) break;
        }
      } catch (err) {
        console.log(JSON.stringify({ event: 'stream_error', message: String(err) }));
      } finally {
        await reader.cancel().catch(() => {});
      }

      if (leaked) {
        console.log(JSON.stringify({ event: 'canary_block' }));
        controller.enqueue(encoder.encode(sse({ error: 'blocked' })));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
