import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { useLanguage } from '../../i18n/Language'

import type { HeroProps } from './Hero.types'

import { SanchoChat, TechStrip } from '@components'

export const Hero = memo(function Hero({
  line1,
  line2,
  imgSrc,
  imgAlt = 'Portrait',
}: HeroProps) {
  const lang = useLanguage()
  const es = lang === 'es'
  const reduceMotion = useReducedMotion()

  const intro = (
    <>
      <div className="relative">
        <motion.img
          src={imgSrc}
          alt={imgAlt}
          loading="eager"
          decoding="async"
          initial={false}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="
            relative mx-auto block h-full w-full max-w-[88px] sm:max-w-[104px]
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

      <div className="max-w-3xl pt-5">
        <motion.h1
          initial={false}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? undefined : { duration: 0.45 }}
          className="text-center font-extrabold leading-[1.1] text-zinc-900 dark:text-zinc-100
                     text-[clamp(1.6rem,3.4vw,2.65rem)]"
        >
          {line1}
        </motion.h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">{line2}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <a href="mailto:esteban.sanchez.nt@gmail.com" className="inline-flex min-h-11 items-center justify-center rounded-full bg-teal-300 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-roulette-teal">{es ? 'Hablemos de tu proyecto' : 'Let’s discuss your project'}<span aria-hidden className="ml-2">↗</span></a>
        <a href={`${import.meta.env.BASE_URL}${lang}/projects/`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-roulette-teal dark:border-white/20 dark:text-zinc-200 dark:hover:bg-white/10">{es ? 'Explorar proyectos' : 'Explore projects'}<span aria-hidden className="ml-2">→</span></a>
      </div>
      <div className="flex w-full justify-center">
        <TechStrip />
      </div>
    </>
  )

  return (
    <section className="relative mx-auto min-h-[calc(100dvh-65px)] max-w-5xl py-6 sm:py-10">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-zinc-200/80 dark:bg-white/10" />
      <SanchoChat intro={intro} />
    </section>
  )
})
