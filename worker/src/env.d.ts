// Secrets set via `wrangler secret put` — merged into the generated Env interface.
interface Env {
  GROQ_API_KEY: string;
  CANARY: string;
}
