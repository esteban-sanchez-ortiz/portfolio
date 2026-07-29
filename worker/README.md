# sancho-chat — Worker del asistente

Backend del chat de Sancho: Cloudflare Worker que llama a Groq con streaming SSE.
El sitio (GitHub Pages) le habla por `POST /api/chat`.

## Guardrails (defensa en capas)

| Capa | Qué hace | Dónde |
|------|----------|-------|
| CORS allowlist | Solo el sitio y localhost pueden llamar | `index.ts` |
| Rate limit | 12 req/min por IP (binding `ratelimit`) | `wrangler.jsonc` |
| Tope diario | 1500 mensajes/día global (KV) — protege cuota Groq | `index.ts` |
| Validación estricta | Máx 24 mensajes, 2000 chars c/u, solo roles `user`/`assistant` (el rol `system` del cliente se rechaza), strip de caracteres de control y zero-width | `guard.ts` |
| Llama Prompt Guard 2 | Clasificador anti-inyección sobre **cada** mensaje `user` (historial incluido — el cliente podría falsificarlo). Malicioso → respuesta enlatada en personaje, nunca llega al modelo principal | `guard.ts` |
| Prompt endurecido | Protocolo de input no confiable en `ai/system-prompt.md` | fase 1 |
| Canario secreto | Token secreto (nunca en el repo) inyectado al prompt; si aparece en la salida, el stream se corta — detecta exfiltración del prompt | `prompt.ts` + `chat.ts` |
| Límites de salida | `max_tokens: 600` | `chat.ts` |
| Fail-closed vs fail-open | Guard con error de API deja pasar (UX) pero loggea; canario siempre corta | `guard.ts` |

Nota: `ai/system-prompt.md` vive en un repo público — el prompt no es secreto y no
necesita serlo; la seguridad está en las reglas + capas de código, no en la oscuridad.
El canario sí es secreto (solo existe como secret del Worker).

## Setup (una vez)

```bash
cd worker && npm install
```

```bash
npx wrangler login
```

Crear el KV del contador diario y pegar el `id` resultante en `wrangler.jsonc`:

```bash
npx wrangler kv namespace create USAGE
```

Secrets (te pedirá el valor de forma interactiva — nunca lo pongas en un archivo del repo):

```bash
npx wrangler secret put GROQ_API_KEY
```

```bash
openssl rand -hex 16 | npx wrangler secret put CANARY
```

## Desarrollo local

Crea `worker/.dev.vars` (gitignored):

```
GROQ_API_KEY=tu_key_de_groq
CANARY=cualquier-token-local
```

```bash
npm run dev
```

## Deploy

```bash
npm run deploy
```

Después del deploy, agrega el dominio final del Worker a la variable que use el
frontend, y si cambias `ALLOWED_ORIGINS` en `wrangler.jsonc`, redeploy.

## Protocolo SSE propio

```
data: {"delta":"texto"}   fragmento de respuesta
data: {"error":"blocked"} respuesta bloqueada por canario
data: [DONE]              fin
```

Errores JSON planos: `rate_limited` (429), `daily_cap` (429), `forbidden_origin` (403),
`invalid_*` (400), `upstream_error` (502).
