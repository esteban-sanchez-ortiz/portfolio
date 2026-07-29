const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface LeadInput {
  name: string
  company: string
  email: string
  message?: string
}

function sanitize(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const clean = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\u202A-\u202E\uFEFF]/g, '').trim()
  return clean.length > 0 && clean.length <= max ? clean : null
}

export function validateLead(body: unknown): LeadInput | null {
  if (typeof body !== 'object' || body === null) return null
  const { name, company, email, message } = body as Record<string, unknown>

  const cleanName = sanitize(name, 80)
  const cleanCompany = sanitize(company, 120)
  const cleanEmail = sanitize(email, 120)
  if (!cleanName || !cleanCompany || !cleanEmail || !EMAIL_RE.test(cleanEmail)) return null

  const cleanMessage = message === undefined ? undefined : (sanitize(message, 500) ?? undefined)
  return { name: cleanName, company: cleanCompany, email: cleanEmail, message: cleanMessage }
}

export async function saveLead(env: Env, lead: LeadInput): Promise<void> {
  const key = `lead:${new Date().toISOString()}:${crypto.randomUUID().slice(0, 8)}`
  await env.LEADS.put(key, JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }))
  console.log(JSON.stringify({ event: 'lead_saved', company: lead.company }))
}
