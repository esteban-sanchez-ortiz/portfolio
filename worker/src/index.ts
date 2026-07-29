import { validateMessages, detectInjection } from './guard';
import { buildSystemPrompt } from './prompt';
import { streamChat } from './chat';
import { validateLead, saveLead } from './leads';

const BLOCKED_REPLY_ES = 'Buen intento, pero escudero fiel no cambia de amo. ¿Hablamos de Esteban?';
const BLOCKED_REPLY_EN = "Nice try, but a loyal squire serves one master. Shall we talk about Esteban?";

function corsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function resolveOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
  return allowed.includes(origin) ? origin : null;
}

function withCors(response: Response, origin: string): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(corsHeaders(origin))) headers.set(k, v as string);
  return new Response(response.body, { status: response.status, headers });
}

/** Rough "looks Spanish" check so canned refusals match the visitor's language. */
function looksSpanish(text: string): boolean {
  return /[áéíóúñ¿¡]|\b(que|como|cuanto|donde|hola|salario|sueldo|por|para|trabajo)\b/i.test(
    text.toLowerCase(),
  );
}

async function underDailyCap(env: Env, ctx: ExecutionContext): Promise<boolean> {
  const key = `usage:${new Date().toISOString().slice(0, 10)}`;
  const current = Number((await env.USAGE.get(key)) ?? '0');
  if (current >= Number(env.DAILY_MESSAGE_CAP)) return false;
  ctx.waitUntil(env.USAGE.put(key, String(current + 1), { expirationTtl: 172800 }));
  return true;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const origin = resolveOrigin(request, env);

    if (request.method === 'OPTIONS') {
      if (!origin) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const isChat = url.pathname === '/api/chat' && request.method === 'POST';
    const isLead = url.pathname === '/api/lead' && request.method === 'POST';
    if (!isChat && !isLead) {
      return Response.json({ error: 'not_found' }, { status: 404 });
    }
    if (!origin) {
      return Response.json({ error: 'forbidden_origin' }, { status: 403 });
    }

    try {
      const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) {
        console.log(JSON.stringify({ event: 'rate_limited', ip }));
        return withCors(Response.json({ error: 'rate_limited' }, { status: 429 }), origin);
      }

      if (isLead) {
        const lead = validateLead(await request.json().catch(() => null));
        if (!lead) {
          return withCors(Response.json({ error: 'invalid_lead' }, { status: 400 }), origin);
        }
        await saveLead(env, lead);
        return withCors(Response.json({ ok: true }, { status: 201 }), origin);
      }

      if (!(await underDailyCap(env, ctx))) {
        console.log(JSON.stringify({ event: 'daily_cap_reached' }));
        return withCors(Response.json({ error: 'daily_cap' }, { status: 429 }), origin);
      }

      const validation = validateMessages(await request.json().catch(() => null));
      if (!validation.ok) {
        return withCors(Response.json({ error: validation.error }, { status: 400 }), origin);
      }
      const { messages } = validation;

      const injected = await detectInjection(env.GROQ_API_KEY, env.GUARD_MODEL, messages);
      if (injected) {
        console.log(JSON.stringify({ event: 'guard_block', ip }));
        const lastUser = messages[messages.length - 1]?.content ?? '';
        const reply = looksSpanish(lastUser) ? BLOCKED_REPLY_ES : BLOCKED_REPLY_EN;
        // Canned in-character refusal — the malicious text never reaches the main model.
        return withCors(
          new Response(
            `data: ${JSON.stringify({ delta: reply })}\n\ndata: [DONE]\n\n`,
            { headers: { 'Content-Type': 'text/event-stream; charset=utf-8' } },
          ),
          origin,
        );
      }

      const systemPrompt = buildSystemPrompt(env.CANARY);
      const response = await streamChat(
        env.GROQ_API_KEY,
        env.GROQ_MODEL,
        env.GROQ_FALLBACK_MODEL,
        systemPrompt,
        messages,
        env.CANARY,
      );
      return withCors(response, origin);
    } catch (err) {
      console.log(JSON.stringify({ event: 'unhandled_error', message: String(err) }));
      return withCors(Response.json({ error: 'internal_error' }, { status: 500 }), origin);
    }
  },
} satisfies ExportedHandler<Env>;
