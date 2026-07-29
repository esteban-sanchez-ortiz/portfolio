import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { SanchoCard } from './SanchoCard'
import { SanchoMascot } from './SanchoMascot'
import { CARD_TOKEN_RE, type CardKind } from './cards.data'

import { useSanchoChat } from '@hooks'

const COPY = {
  es: {
    eyebrow: 'SANCHO — escudero digital de Esteban',
    greeting: '¡Hola! Soy Sancho, el escudero digital de Esteban. Pregúntame lo que quieras 👇',
    placeholder: 'Pregúntale a Sancho sobre Esteban…',
    send: 'Enviar',
    chips: ['¿Qué stack domina?', '¿Ha liderado equipos?', '¿Está abierto a ofertas?'],
    rate_limited: 'Sancho recupera el aliento. Intenta en unos segundos.',
    unavailable: 'Sancho se enredó con los molinos. Intenta de nuevo.',
    schedule: 'Quiero agendar una entrevista con Esteban',
  },
  en: {
    eyebrow: "SANCHO — Esteban's digital squire",
    greeting: "Hi! I'm Sancho, Esteban's digital squire. Ask me anything 👇",
    placeholder: 'Ask Sancho about Esteban…',
    send: 'Send',
    chips: ['What stack does he master?', 'Has he led teams?', 'Is he open to offers?'],
    rate_limited: 'Sancho is catching his breath. Try again in a few seconds.',
    unavailable: 'Sancho got tangled with the windmills. Try again.',
    schedule: 'I want to schedule an interview with Esteban',
  },
} as const

/** Split an assistant message into clean text + card tokens the model emitted. */
function parseAssistant(content: string): { text: string; cards: CardKind[] } {
  const cards: CardKind[] = []
  const text = content
    .replace(CARD_TOKEN_RE, (_, kind: CardKind) => {
      if (!cards.includes(kind)) cards.push(kind)
      return ''
    })
    .replace(/\*\*/g, '')
    .trim()
  return { text, cards: cards.slice(0, 1) }
}

interface SanchoChatProps {
  /** Hero content (portrait, headline, tech strip) shown until the chat starts. */
  intro?: ReactNode
}

/**
 * Full-height chat layout: free-flowing thread in the middle (only element
 * that scrolls), input docked at the bottom, intro centered until first message.
 */
export const SanchoChat = memo(function SanchoChat({ intro }: SanchoChatProps) {
  const { messages, status, error, send } = useSanchoChat()
  const [input, setInput] = useState('')
  const reduceMotion = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const es = useMemo(() => navigator.language.toLowerCase().startsWith('es'), [])
  const t = es ? COPY.es : COPY.en

  const started = messages.length > 0
  const streaming = status === 'streaming'
  const lastAssistant = messages[messages.length - 1]
  const waitingFirstDelta =
    streaming && lastAssistant?.role === 'assistant' && lastAssistant.content === ''

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const submit = (text: string) => {
    if (!text.trim() || streaming) return
    void send(text)
    setInput('')
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Legibility scrim: mutes the background blobs while chatting */}
      <AnimatePresence initial={false}>
        {started && (
          <motion.div
            key="scrim"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 bg-white/75 backdrop-blur-sm dark:bg-black/60"
          />
        )}
      </AnimatePresence>

      {/* Center: the only scrollable area */}
      <div ref={scrollRef} className="sancho-scroll relative min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {!started && (
            <motion.div
              key="intro"
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-full flex-col items-center justify-center px-4"
            >
              {intro}
              <div className="mt-6 flex flex-col items-center gap-3">
                <SanchoMascot size={72} wave={!reduceMotion} />
                <div
                  className="max-w-xs rounded-xl border border-zinc-200 bg-white/80 px-4 py-2 text-center
                             backdrop-blur dark:border-white/10 dark:bg-white/[0.06] sm:max-w-none"
                >
                  <p className="font-mono text-xs text-zinc-700 dark:text-zinc-200 sm:text-sm">
                    {t.greeting}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {started && (
          <div aria-live="polite" className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6">
            {messages.map((m, i) => {
              if (m.role === 'user') {
                return (
                  <motion.p
                    key={i}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-auto w-fit max-w-[85%] rounded-xl bg-zinc-100 px-3 py-2
                               text-sm text-zinc-800 dark:bg-white/10 dark:text-zinc-100"
                  >
                    {m.content}
                  </motion.p>
                )
              }
              const { text, cards } = parseAssistant(m.content)
              const isLast = i === messages.length - 1
              if (!text && !cards.length) return null
              return (
                <motion.div
                  key={i}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex max-w-[92%] gap-2.5"
                >
                  <SanchoMascot size={20} className="mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {text}
                      {streaming && isLast && (
                        <span
                          aria-hidden
                          className="ml-0.5 inline-block h-4 w-[7px] translate-y-[3px] bg-roulette-teal
                                     [animation:dotpulse_1s_ease-in-out_infinite]"
                        />
                      )}
                    </p>
                    {(!streaming || !isLast) &&
                      cards.map(kind => (
                        <SanchoCard
                          key={kind}
                          kind={kind}
                          es={es}
                          onSchedule={() => submit(t.schedule)}
                        />
                      ))}
                  </div>
                </motion.div>
              )
            })}
            {waitingFirstDelta && (
              <div className="flex items-center gap-2.5">
                <SanchoMascot
                  size={20}
                  className={reduceMotion ? '' : 'animate-bounce [animation-duration:1.2s]'}
                />
                <span className="flex gap-1" aria-hidden>
                  {[0, 1, 2].map(d => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-zinc-400 [animation:dotpulse_1.2s_ease-in-out_infinite] dark:bg-zinc-500"
                      style={{ animationDelay: `${d * 0.2}s` }}
                    />
                  ))}
                </span>
              </div>
            )}
            {error && (
              <p className="font-mono text-xs text-roulette-magenta">
                {error === 'rate_limited' ? t.rate_limited : t.unavailable}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom dock: chips + input, always visible */}
      <div className="relative shrink-0 px-4 pb-5 pt-2 sm:px-6">
        <AnimatePresence initial={false}>
          {!started && (
            <motion.div
              key="chips"
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mb-3 flex max-w-2xl flex-wrap justify-center gap-2 overflow-hidden"
            >
              {t.chips.map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => submit(chip)}
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600
                             transition hover:border-roulette-teal/60 hover:text-zinc-900
                             dark:border-white/10 dark:text-zinc-400 dark:hover:border-roulette-teal/60
                             dark:hover:text-white
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-roulette-teal"
                >
                  {chip}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={e => {
            e.preventDefault()
            submit(input)
          }}
          className={`mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl border
                     bg-white/70 p-2 pl-4 backdrop-blur dark:bg-white/[0.03] ${
                       started
                         ? 'border-zinc-200 dark:border-white/10'
                         : 'border-roulette-teal/40 [animation:sancho-cta-glow_2.4s_ease-in-out_infinite] motion-reduce:animate-none'
                     }`}
        >
          <span aria-hidden className="select-none font-mono text-base text-roulette-teal">
            ❯
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            maxLength={2000}
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent py-2 font-mono text-sm text-zinc-900
                       placeholder-zinc-400 outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition
                       enabled:hover:bg-zinc-100 enabled:hover:text-zinc-900
                       disabled:opacity-40 dark:enabled:hover:bg-white/10 dark:enabled:hover:text-white
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-roulette-teal"
          >
            {t.send}
          </button>
        </form>
      </div>
    </div>
  )
})
