import { motion, useReducedMotion } from 'framer-motion'
import { SparklesLayer } from '@components'
import { backgroundConfig } from '@data'

export const Background = () => {
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden [contain:layout_paint_size_style]"
    >
      {!reduceMotion && (
        <div className="absolute inset-0">
          <SparklesLayer count={backgroundConfig.sparkles.count} seed={backgroundConfig.sparkles.seed} />
        </div>
      )}

      {!reduceMotion &&
        backgroundConfig.blobs.map(b => (
          <motion.div
            key={b.id}
            className={`${b.className} [will-change:transform,opacity] transform-gpu`}
            animate={b.animate}
            transition={{ repeat: Infinity, ease: 'easeInOut', duration: b.duration }}
          />
        ))}
    </div>
  )
}
