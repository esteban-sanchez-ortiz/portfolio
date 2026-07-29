import { memo, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import type { HeroProps } from './Hero.types'

import { SanchoChat, TechStrip } from '@components'

export const Hero = memo(function Hero({
  line1,
  line2,
  highlight,
  imgSrc,
  imgAlt = 'Portrait',
}: HeroProps) {
  const reduceMotion = useReducedMotion()
  const [chatActive, setChatActive] = useState(false)

  const parts = useMemo(() => {
    if (!highlight || !line2.includes(highlight)) return [line2]
    const [a, b] = line2.split(highlight)
    return [a, highlight, b] as const
  }, [line2, highlight])

  return (
    <section className="relative flex h-[calc(100dvh-65px)] flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-zinc-200/80 dark:bg-white/10" />

      <div className="mx-auto grid w-full grid-cols-1 place-items-center px-4 sm:px-6">
        <AnimatePresence initial={false}>
          {!chatActive && (
            <motion.div
              key="intro"
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, height: 0, scale: 0.96, marginBottom: 0 }
              }
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="z-10 flex flex-col items-center overflow-hidden"
            >
              <div className="relative">
                <motion.img
                  src={imgSrc}
                  alt={imgAlt}
                  loading="eager"
                  decoding="async"
                  initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="
                    relative mx-auto block h-full w-full max-w-[140px]
                    rounded-b-full transform-gpu
                    [mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]
                    shadow-[0_20px_80px_-30px_rgba(0,0,0,0.45)]
                  "
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-[60%] -translate-x-1/2 rounded-full
                             bg-gradient-to-b from-zinc-300/40 to-transparent dark:from-white/10 blur-2xl"
                />
              </div>

              <div className="pt-6">
                <motion.h1
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={reduceMotion ? undefined : { duration: 0.45 }}
                  className="text-center font-extrabold leading-[0.95] text-zinc-900 dark:text-zinc-100
                             text-[clamp(1.7rem,4.5vw,3rem)]"
                >
                  {line1}
                  <br />
                  {parts.length === 1 ? (
                    parts[0]
                  ) : (
                    <>
                      {parts[0]}
                      <span className="text-zinc-500">{parts[1]}</span>
                      {parts[2]}
                    </>
                  )}
                </motion.h1>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SanchoChat onStartedChange={setChatActive} />

        <AnimatePresence initial={false}>
          {!chatActive && (
            <motion.div
              key="strip"
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex w-full justify-center overflow-hidden"
            >
              <TechStrip />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
})
