import type { ChatMessage } from './guard';

export interface ChatTarget {
  provider: 'groq' | 'fireworks';
  model: string;
  apiKey: string;
}

const ENDPOINTS = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  fireworks: 'https://api.fireworks.ai/inference/v1/chat/completions',
};
const MAX_OUTPUT_TOKENS = 350;
const ATTEMPT_TIMEOUT_MS = 15000;
const recoverable = (status: number) => status === 404 || status === 408 || status === 429 || status >= 500;
const sse = (data: unknown) => `data: ${JSON.stringify(data)}\n\n`;

/** At most one fallback, only before any answer text has been sent. Never log credentials or prompts. */
export async function streamChat(
  targets: ChatTarget[],
  systemPrompt: string,
  messages: ChatMessage[],
  canary: string,
  timeoutMs = ATTEMPT_TIMEOUT_MS,
): Promise<Response> {
  if (!targets.length || !targets[0]?.apiKey) {
    return Response.json({ error: 'provider_not_configured' }, { status: 503 });
  }
  const encoder = new TextEncoder();
  const markers = [canary, '[CANARY:', 'Hard rules (never break', 'untrusted input protocol'].filter(Boolean);
  const stream = new ReadableStream<Uint8Array>({
    async start(output) {
      let emitted = false;
      let blocked = false;
      let completed = false;
      for (const [i, target] of targets.slice(0, 2).entries()) {
        if (!target.apiKey) continue;
        const abort = new AbortController();
        const timer = setTimeout(() => abort.abort(), timeoutMs);
        let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
        let retry = false;
        let accumulated = '';
        let providerDone = false;
        try {
          const response = await fetch(ENDPOINTS[target.provider], {
            method: 'POST',
            headers: { Authorization: `Bearer ${target.apiKey}`, 'Content-Type': 'application/json' },
            signal: abort.signal,
            body: JSON.stringify({
              model: target.model,
              stream: true,
              max_tokens: target.provider === 'groq' ? 1024 : MAX_OUTPUT_TOKENS,
              temperature: 0.6,
              ...(target.provider === 'groq' && target.model.startsWith('openai/gpt-oss-')
                ? { reasoning_effort: 'low', include_reasoning: false } : {}),
              ...(target.provider === 'fireworks' ? { reasoning_effort: 'none' } : {}),
              messages: [{ role: 'system', content: systemPrompt }, ...messages],
            }),
          });
          if (!response.ok || !response.body) {
            console.log(JSON.stringify({ event: 'chat_upstream_error', provider: target.provider, model: target.model, status: response.status }));
            retry = recoverable(response.status);
            await response.body?.cancel();
          } else {
            reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            const consume = (line: string) => {
              if (!line.trim().startsWith('data:')) return;
              const payload = line.trim().slice(5).trim();
              if (payload === '[DONE]') { providerDone = true; return; }
              const chunk = JSON.parse(payload) as { error?: unknown; choices?: { delta?: { content?: string }; finish_reason?: string | null }[] };
              if (chunk.error) throw new Error('provider_stream_error');
              // Separate reasoning/reasoning_content fields are intentionally ignored.
              const delta = chunk.choices?.[0]?.delta?.content ?? '';
              if (!delta) return;
              accumulated += delta;
              if (markers.some(marker => accumulated.includes(marker))) { blocked = true; return; }
              emitted = true;
              output.enqueue(encoder.encode(sse({ delta })));
            };
            while (!providerDone && !blocked) {
              const { done, value } = await reader.read();
              if (done) { buffer += decoder.decode(); if (buffer.trim()) consume(buffer); break; }
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() ?? '';
              for (const line of lines) { consume(line); if (providerDone || blocked) break; }
            }
            completed = providerDone && !!accumulated && !blocked;
            if (completed) console.log(JSON.stringify({ event: 'chat_completed', provider: target.provider, model: target.model }));
            retry = !completed && !blocked;
          }
        } catch {
          console.log(JSON.stringify({ event: 'chat_transport_error', provider: target.provider, model: target.model, timeout: abort.signal.aborted }));
          retry = true;
        } finally {
          clearTimeout(timer);
          await reader?.cancel().catch(() => {});
        }
        if (completed || blocked || emitted || !retry) break;
        if (i === 0 && targets[1]?.apiKey) {
          console.log(JSON.stringify({ event: 'chat_fallback', from: target.provider, to: targets[1].provider }));
        }
      }
      if (!completed) output.enqueue(encoder.encode(sse({ error: blocked ? 'blocked' : 'unavailable' })));
      output.enqueue(encoder.encode('data: [DONE]\n\n'));
      output.close();
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' } });
}
