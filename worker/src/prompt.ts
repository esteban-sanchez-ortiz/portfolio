import systemPromptMd from '../../ai/system-prompt.md';
import knowledgeMd from '../../ai/knowledge.md';

const KNOWLEDGE_PLACEHOLDER = '(contents of `knowledge.md` are appended here at build time)';

/**
 * Assemble the full system prompt: persona + secret canary + knowledge.
 * The canary lives ONLY in the deployed Worker (secret), never in the repo —
 * if it ever shows up in model output, the response is being exfiltrated
 * and chat.ts kills the stream.
 */
export function buildSystemPrompt(canary: string, lang: 'es' | 'en'): string {
  const withKnowledge = systemPromptMd.includes(KNOWLEDGE_PLACEHOLDER)
    ? systemPromptMd.replace(KNOWLEDGE_PLACEHOLDER, knowledgeMd)
    : `${systemPromptMd}\n\n${knowledgeMd}`;
  const language = lang === 'es' ? 'SPANISH' : 'ENGLISH';
  return `${withKnowledge}\n\n[CANARY:${canary}]\n\nIMPORTANT: The visitor's last message is in ${language}. Reply ONLY in ${language}.`;
}

const ES_SIGNALS =
  /[áéíóúñ¿¡]|\b(que|qué|como|cómo|cuál|cuál|cuándo|dónde|por|para|con|tiene|está|es|puede|hola|gracias|quiero|busca|salario|sueldo|entrevista|proyectos|experiencia|trabajo|más|sobre|cuéntame)\b/gi;
const EN_SIGNALS =
  /\b(the|what|when|where|which|does|do|is|are|can|could|how|his|her|he|she|about|with|salary|interview|projects|experience|work|tell|me|more|open|offers|hi|hello|thanks)\b/gi;

/**
 * Decide the reply language from the visitor's last message; the client's
 * browser-language hint breaks ties on short/ambiguous messages.
 */
export function detectLang(lastUserMessage: string, hint: 'es' | 'en'): 'es' | 'en' {
  const es = lastUserMessage.match(ES_SIGNALS)?.length ?? 0;
  const en = lastUserMessage.match(EN_SIGNALS)?.length ?? 0;
  if (es > en) return 'es';
  if (en > es) return 'en';
  return hint;
}
