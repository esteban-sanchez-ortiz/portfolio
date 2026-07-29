import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { AVAILABILITY, EXPERIENCE, PROJECTS, type CardKind } from './cards.data'

const API_URL =
  (import.meta.env.VITE_SANCHO_API as string | undefined) ??
  'https://sancho-chat.esteban-sanchez-nt.workers.dev'

const COPY = {
  es: {
    schedule: 'Proponer entrevista',
    send: 'Enviar',
    sending: 'Enviando…',
    sent: 'Recibido. Esteban te contacta pronto.',
    failed: 'No se pudo enviar. Intenta de nuevo.',
    name: 'Nombre',
    company: 'Empresa',
    email: 'Email',
    message: 'Mensaje (opcional)',
  },
  en: {
    schedule: 'Propose an interview',
    send: 'Send',
    sending: 'Sending…',
    sent: 'Got it. Esteban will reach out soon.',
    failed: 'Could not send. Try again.',
    name: 'Name',
    company: 'Company',
    email: 'Email',
    message: 'Message (optional)',
  },
} as const

const cardShell =
  'mt-2 w-full max-w-md rounded-xl border border-zinc-200 bg-white/60 p-4 ' +
  'dark:border-white/10 dark:bg-white/[0.04]'
const label = 'font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500'

function ExperienceCard() {
  return (
    <div className={cardShell}>
      <p className={label}>Experience</p>
      <ul className="mt-2 space-y-2">
        {EXPERIENCE.map(e => (
          <li key={e.company} className="flex items-baseline justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                {e.company}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {e.role} · {e.stack}
              </p>
            </div>
            <span className="shrink-0 font-mono text-[11px] text-roulette-teal">{e.period}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectsCard() {
  return (
    <div className={cardShell}>
      <p className={label}>Projects</p>
      <ul className="mt-2 space-y-3">
        {PROJECTS.map(p => (
          <li key={p.name}>
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg p-2 -m-2 transition hover:bg-zinc-100 dark:hover:bg-white/5"
            >
              <p className="text-sm font-medium text-zinc-800 group-hover:underline dark:text-zinc-100">
                {p.name} <span aria-hidden>↗</span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{p.desc}</p>
              <p className="mt-0.5 font-mono text-[11px] text-roulette-teal">{p.stack}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AvailabilityCard({ es, onSchedule }: { es: boolean; onSchedule: () => void }) {
  const t = es ? COPY.es : COPY.en
  return (
    <div className={cardShell}>
      <p className={label}>{es ? 'Disponibilidad' : 'Availability'}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-mono text-sm text-zinc-800 dark:text-zinc-100">
          {AVAILABILITY.window}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{AVAILABILITY.tz}</span>
        <span className="text-xs text-roulette-teal">{AVAILABILITY.mode}</span>
      </div>
      <button
        type="button"
        onClick={onSchedule}
        className="mt-3 rounded-lg border border-roulette-teal/50 px-3 py-1.5 text-sm font-medium
                   text-roulette-teal transition hover:bg-roulette-teal/10
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-roulette-teal"
      >
        {t.schedule}
      </button>
    </div>
  )
}

function ContactCard({ es }: { es: boolean }) {
  const t = es ? COPY.es : COPY.en
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')

  const inputCls =
    'w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm ' +
    'text-zinc-900 placeholder-zinc-400 outline-none transition ' +
    'focus:border-roulette-teal dark:border-white/10 dark:text-zinc-100 dark:placeholder-zinc-500'

  if (state === 'sent') {
    return (
      <div className={cardShell}>
        <p className="font-mono text-sm text-roulette-teal">{t.sent}</p>
      </div>
    )
  }

  return (
    <form
      className={cardShell}
      onSubmit={async e => {
        e.preventDefault()
        if (state === 'sending') return
        const data = new FormData(e.currentTarget)
        setState('sending')
        try {
          const res = await fetch(`${API_URL}/api/lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: data.get('name'),
              company: data.get('company'),
              email: data.get('email'),
              message: data.get('message') || undefined,
            }),
          })
          setState(res.ok ? 'sent' : 'failed')
        } catch {
          setState('failed')
        }
      }}
    >
      <p className={label}>{es ? 'Contacto' : 'Contact'}</p>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input name="name" required maxLength={80} placeholder={t.name} className={inputCls} />
        <input name="company" required maxLength={120} placeholder={t.company} className={inputCls} />
      </div>
      <input
        name="email"
        type="email"
        required
        maxLength={120}
        placeholder={t.email}
        className={`${inputCls} mt-2`}
      />
      <textarea
        name="message"
        maxLength={500}
        rows={2}
        placeholder={t.message}
        className={`${inputCls} mt-2 resize-none`}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="rounded-lg border border-roulette-teal/50 px-3 py-1.5 text-sm font-medium
                     text-roulette-teal transition hover:bg-roulette-teal/10 disabled:opacity-50
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-roulette-teal"
        >
          {state === 'sending' ? t.sending : t.send}
        </button>
        {state === 'failed' && (
          <p className="text-xs text-roulette-magenta">{t.failed}</p>
        )}
      </div>
    </form>
  )
}

interface SanchoCardProps {
  kind: CardKind
  es: boolean
  onSchedule: () => void
}

export const SanchoCard = ({ kind, es, onSchedule }: SanchoCardProps) => {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {kind === 'experience' && <ExperienceCard />}
      {kind === 'projects' && <ProjectsCard />}
      {kind === 'availability' && <AvailabilityCard es={es} onSchedule={onSchedule} />}
      {kind === 'contact' && <ContactCard es={es} />}
    </motion.div>
  )
}
