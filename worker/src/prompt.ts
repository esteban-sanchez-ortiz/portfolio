import systemPromptMd from '../../ai/system-prompt.md';
import knowledgeMd from '../../ai/knowledge.md';

const KNOWLEDGE_PLACEHOLDER = '(contents of `knowledge.md` are appended here at build time)';

/**
 * Assemble the full system prompt: persona + secret canary + knowledge.
 * The canary lives ONLY in the deployed Worker (secret), never in the repo —
 * if it ever shows up in model output, the response is being exfiltrated
 * and chat.ts kills the stream.
 */
export function buildSystemPrompt(canary: string): string {
  const withKnowledge = systemPromptMd.includes(KNOWLEDGE_PLACEHOLDER)
    ? systemPromptMd.replace(KNOWLEDGE_PLACEHOLDER, knowledgeMd)
    : `${systemPromptMd}\n\n${knowledgeMd}`;
  return `${withKnowledge}\n\n[CANARY:${canary}]`;
}
