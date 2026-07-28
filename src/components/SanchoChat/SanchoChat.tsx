import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { useSanchoChat } from '@hooks'

const COPY = {
  es: {
    eyebrow: 'SANCHO — escudero digital de Esteban',
    placeholder: 'Pregúntale a Sancho sobre Esteban…',
    send: 'Enviar',
    chips: ['¿Qué stack domina?', '¿Ha liderado equipos?', '¿Está abierto a ofertas?'],
    rate_limited: 'Sancho recupera el aliento. Intenta en unos segundos.',
    unavailable: 'Sancho se enredó con los molinos. Intenta de nuevo.',
    thinking: 'Sancho piensa…',
  },
  en: {
    eyebrow: "SANCHO — Esteban's digital squire",
    placeholder: 'Ask Sancho about Esteban…',
    send: 'Send',
    chips: ['What stack does he master?', 'Has he led teams?', 'Is he open to offers?'],
    rate_limited: 'Sancho is catching his breath. Try again in a few seconds.',
    unavailable: 'Sancho got tangled with the windmills. Try again.',
    thinking: 'Sancho is thinking…',
  },
} as const

export const SanchoChat = memo(function SanchoChat() {
  const { messages, status, error, send } = useSanchoChat()
  const [input, setInput] = useState('')
  const reduceMotion = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const t = useMemo(
    () => (navigator.language.toLowerCase().startsWith('es') ? COPY.es : COPY.en),
    [],
  )

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
    <motion.div
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="z-10 mt-8 w-full max-w-2xl"
    >
      <div className="mb-2 flex items-center gap-2 px-1">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-roulette-teal [animation:dotpulse_1.6s_ease-in-out_infinite]"
        />
        <p className="font-mono text-[11px] tracking-widest text-zinc-500 dark:text-zinc-400">
          {t.eyebrow}
        </p>
      </div>

      <div
        className="rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur
                   dark:border-white/10 dark:bg-white/[0.03]"
      >
        <AnimatePresence initial={false}>
          {started && (
            <motion.div
              key="thread"
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div
                ref={scrollRef}
                aria-live="polite"
                className="max-h-[38vh] space-y-4 overflow-y-auto scroll-smooth p-4 sm:p-5"
              >
                {messages.map((m, i) =>
                  m.role === 'user' ? (
                    <p
                      key={i}
                      className="ml-auto w-fit max-w-[85%] rounded-xl bg-zinc-100 px-3 py-2
                                 text-sm text-zinc-800 dark:bg-white/10 dark:text-zinc-100"
                    >
                      {m.content}
                    </p>
                  ) : (
                    <div key={i} className="flex max-w-[92%] gap-2">
                      <span aria-hidden className="select-none font-mono text-sm text-roulette-teal">
                        ❯
                      </span>
                      <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {m.content.replace(/\*\*/g, '')}
                        {streaming && i === messages.length - 1 && (
                          <span
                            aria-hidden
                            className="ml-0.5 inline-block h-4 w-[7px] translate-y-[3px] bg-roulette-teal
                                       [animation:dotpulse_1s_ease-in-out_infinite]"
                          />
                        )}
                      </p>
                    </div>
                  ),
                )}
                {waitingFirstDelta && (
                  <p className="font-mono text-xs text-zinc-400 dark:text-zinc-500">{t.thinking}</p>
                )}
                {error && (
                  <p className="font-mono text-xs text-roulette-magenta">
                    {error === 'rate_limited' ? t.rate_limited : t.unavailable}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={e => {
            e.preventDefault()
            submit(input)
          }}
          className={`flex items-center gap-2 p-2 pl-4 ${
            started ? 'border-t border-zinc-200 dark:border-white/10' : ''
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

      {!started && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
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
        </div>
      )}
    </motion.div>
  )
})
