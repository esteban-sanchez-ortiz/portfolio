export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 2000;
const MAX_TOTAL_CHARS = 12000;

export type ValidationResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

/**
 * Strict allowlist validation of the client payload.
 * The client can only ever contribute `user` / `assistant` turns —
 * a `system` role or any unknown field is rejected outright.
 */
export function validateMessages(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'invalid_body' };
  }
  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return { ok: false, error: 'invalid_messages' };
  }

  const clean: ChatMessage[] = [];
  let total = 0;
  for (const raw of messages) {
    if (typeof raw !== 'object' || raw === null) return { ok: false, error: 'invalid_message' };
    const { role, content } = raw as { role?: unknown; content?: unknown };
    if (role !== 'user' && role !== 'assistant') return { ok: false, error: 'invalid_role' };
    if (typeof content !== 'string') return { ok: false, error: 'invalid_content' };

    // Strip control characters (keep \n and \t); collapse zero-width chars used to smuggle text.
    const sanitized = content
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\u202A-\u202E\uFEFF]/g, '')
      .trim();
    if (sanitized.length === 0 || sanitized.length > MAX_MESSAGE_CHARS) {
      return { ok: false, error: 'message_too_long' };
    }
    total += sanitized.length;
    clean.push({ role, content: sanitized });
  }
  if (total > MAX_TOTAL_CHARS) return { ok: false, error: 'conversation_too_long' };
  if (clean[clean.length - 1]?.role !== 'user') return { ok: false, error: 'last_message_not_user' };
  return { ok: true, messages: clean };
}

/**
 * Classify one user message with Llama Prompt Guard 2 on Groq.
 * The response format is not formally documented, so parsing is tolerant:
 * a numeric body is treated as P(malicious); otherwise known labels are matched.
 * Guard API failures fail OPEN (chat still works) but are logged —
 * the system prompt and the canary filter remain as further layers.
 */
async function classifyOne(
  apiKey: string,
  model: string,
  content: string,
): Promise<'malicious' | 'benign' | 'unknown'> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content }],
      max_tokens: 16,
      temperature: 0,
    }),
  });
  if (!res.ok) {
    console.log(JSON.stringify({ event: 'guard_api_error', status: res.status }));
    return 'unknown';
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const out = (data.choices?.[0]?.message?.content ?? '').trim();

  const asNumber = Number(out);
  if (!Number.isNaN(asNumber) && out !== '') {
    return asNumber >= 0.5 ? 'malicious' : 'benign';
  }
  const upper = out.toUpperCase();
  if (/MALICIOUS|JAILBREAK|INJECTION|UNSAFE|LABEL_1/.test(upper)) return 'malicious';
  if (/BENIGN|SAFE|LABEL_0/.test(upper)) return 'benign';
  console.log(JSON.stringify({ event: 'guard_unparsed_output', out: out.slice(0, 80) }));
  return 'unknown';
}

/**
 * Run Prompt Guard over EVERY user message in the conversation.
 * History arrives from the client on each request, so previously "checked"
 * turns cannot be trusted — a forged history is the obvious smuggling path.
 */
export async function detectInjection(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<boolean> {
  const userContents = messages.filter((m) => m.role === 'user').map((m) => m.content);
  const verdicts = await Promise.all(userContents.map((c) => classifyOne(apiKey, model, c)));
  return verdicts.includes('malicious');
}
