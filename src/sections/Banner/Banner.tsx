import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { Chip, Dot } from './components'

import { SocialLink, Icons, Avatar } from '@components'
import { useZonedClock } from '@hooks'

export const Banner = () => {
  const time = useZonedClock()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: -12 }}
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
          <div className="hidden md:flex items-center gap-6 text-sm whitespace-nowrap">
            <Chip
              icon={
                <>
                  {/* Dot con pulso */}
                  <Dot className="bg-green-500 [animation:dotpulse_1.6s_ease-in-out_infinite]" />
                  <Icons.Check className="h-5 w-5" />
                </>
              }
            >
              <span className="font-medium">Available for hire</span>
            </Chip>

            <Chip icon={<Icons.Clock className="h-5 w-5" />}>
              <time className="tabular-nums font-mono">{time}</time>
            </Chip>

            <Chip icon={<Icons.Pin className="h-5 w-5" />}>
              <span>Medellín, Colombia</span>
            </Chip>
          </div>

          <div className="md:hidden flex items-center gap-2 text-sm whitespace-nowrap">
            <Chip icon={<Icons.Pin className="h-5 w-5" />}>
              <span>Medellín, Colombia</span>
            </Chip>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SocialLink href="https://www.linkedin.com/in/hikso/" label="LinkedIn">
            <Icons.LinkedIn className="h-10 w-10 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]" />
          </SocialLink>
        </div>
      </div>
    </motion.section>
  )
}
