import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import type { ExperienceItemProps } from './ExperienceItem.types'

import { BrandAvatar } from '@components'

const INTENSITY = 1

export const ExperienceItem = ({
  role,
  company,
  period,
  location,
  summary,
  bullets,
  image,
  url,
}: ExperienceItemProps) => {
  const ref = useRef<HTMLLIElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 15%'] })
  const lift = useTransform(scrollYProgress, [0, 1], [0, -4 * INTENSITY]) // row lift
  const yAvatar = useTransform(scrollYProgress, [0, 1], [`${-6 * INTENSITY}%`, `${6 * INTENSITY}%`])

  return (
    <motion.li
      ref={ref}
      style={{ y: lift }}
      className="relative flex gap-4 py-5"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
    >
      {/* Avatar */}
      <motion.div style={{ y: yAvatar }}>
        <BrandAvatar src={image} company={company} />
      </motion.div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="truncate text-base md:text-lg font-semibold text-zinc-100">
            {role} · <span className="text-zinc-300">{company}</span>
          </h3>
          <span className="hidden sm:inline text-xs text-zinc-500">•</span>
          <p className="hidden sm:inline text-xs text-zinc-400">
            {period} · {location}
          </p>
        </div>

        <p className="mt-1.5 text-sm text-zinc-300">{summary}</p>

        {bullets?.length ? (
          <ul className="mt-2 space-y-1.5">
            {bullets.map((b, i) => (
              <li key={i} className="text-sm text-zinc-400 leading-relaxed">
                • {b}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/15 hover:border-emerald-500/50"
          >
            Visit their site
            <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-80">
              <path
                fill="currentColor"
                d="M5 12h11l-4.5-4.5l1.4-1.4L20.8 12l-7.9 7.9l-1.4-1.4L16 13H5z"
              />
            </svg>
          </a>
        </div>
      </div>
    </motion.li>
  )
}
