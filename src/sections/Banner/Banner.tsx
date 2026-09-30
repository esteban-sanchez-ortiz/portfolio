import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'

import { useLanguage, pageFromPath } from '../../i18n/Language'

import { Chip, Dot } from './components'

import { SocialLink, Icons, Avatar, NavMenu } from '@components'
import { useZonedClock } from '@hooks'

export const Banner = () => {
  const time = useZonedClock()
  const lang = useLanguage()
  const [pagePath] = useLocation()
  const page = pageFromPath(pagePath)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.section
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className={[
        'sticky top-0 z-50',
        'w-full border-b border-zinc-200 dark:border-zinc-800',
        'backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-black/40',
        'bg-white/90 dark:bg-black/80',
        'transition-shadow duration-300',
        scrolled ? 'shadow-sm' : 'shadow-none',
      ].join(' ')}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar />
          {/* Desktop chips */}
          <div className="hidden lg:flex items-center gap-6 text-sm whitespace-nowrap">
            <Chip
              icon={
                <>
                  {/* Dot con pulso */}
                  <Dot className="bg-green-500 [animation:dotpulse_1.6s_ease-in-out_infinite]" />
                  <Icons.Check className="h-5 w-5" />
                </>
              }
            >
              <span className="font-medium">{lang === 'es' ? 'Contratos y proyectos' : 'Contracts & projects'}</span>
            </Chip>

            <Chip icon={<Icons.Clock className="h-5 w-5" />}>
              <time className="tabular-nums font-mono">{time}</time>
            </Chip>

            <Chip icon={<Icons.Pin className="h-5 w-5" />}>
              <span>Medellín, Colombia</span>
            </Chip>
          </div>

          <div className="hidden sm:flex lg:hidden items-center gap-2 text-sm whitespace-nowrap">
            <Chip icon={<Icons.Pin className="h-5 w-5" />}>
              <span>Medellín, Colombia</span>
            </Chip>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-zinc-200 bg-zinc-100 p-1 text-xs dark:border-white/10 dark:bg-white/5" aria-label={lang === 'es' ? 'Idioma' : 'Language'}>
            {(['es', 'en'] as const).map(l => <a key={l} href={`${import.meta.env.BASE_URL}${l}/${page ? `${page}/` : ''}`} lang={l} hrefLang={l} aria-current={l === lang ? 'true' : undefined} aria-label={l === 'es' ? 'Español' : 'English'} className={`rounded-full px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-roulette-teal ${l === lang ? 'bg-white font-semibold text-zinc-900 shadow-sm dark:bg-white/15 dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}>{l.toUpperCase()}</a>)}
          </div>
          <NavMenu />
          <SocialLink href="https://www.linkedin.com/in/esteban-sanchez-ortiz" label="LinkedIn">
            <Icons.LinkedIn className="h-10 w-10 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]" />
          </SocialLink>
        </div>
      </div>
    </motion.section>
  )
}
