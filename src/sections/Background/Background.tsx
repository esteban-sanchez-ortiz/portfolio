import { motion, useReducedMotion } from 'framer-motion'

import { SparklesLayer } from '@components'

const BLOBS = [
  {
    id: 'b1',
    className:
      'absolute top-1/2 left-1/2 h-72 w-72 rounded-full bg-gradient-to-tr from-roulette-black to-roulette-gray blur-3xl opacity-40 -translate-x-[80%] -translate-y-[120%]',
    animate: { x: [0, 20, 0], y: [0, 15, 0] },
    duration: 8,
  },
  {
    id: 'b2',
    className:
      'absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-roulette-gray to-roulette-teal blur-3xl opacity-40 translate-x-[70%] -translate-y-[80%]',
    animate: { x: [0, -20, 0], y: [0, -15, 0] },
    duration: 10,
  },
  {
    id: 'b3',
    className:
      'absolute top-1/2 left-1/2 h-52 w-52 rounded-full bg-gradient-to-tr from-roulette-teal to-roulette-magenta blur-3xl opacity-45 -translate-x-[90%] translate-y-[60%]',
    animate: { x: [0, 15, 0], y: [0, -10, 0] },
    duration: 9,
  },
  {
    id: 'b4',
    className:
      // 👇 ojo al guion en translate-x-[65%]
      'absolute top-1/2 left-1/2 h-56 w-56 rounded-full bg-gradient-to-tr from-roulette-black to-roulette-magenta blur-3xl opacity-35 translate-x-[65%] translate-y-[70%]',
    animate: { x: [0, -15, 0], y: [0, 12, 0] },
    duration: 11,
  },
]
export const Background = () => {
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden [contain:layout_paint_size_style]"
    >
      {!reduceMotion && (
        <div className="absolute inset-0">
          <SparklesLayer count={28} seed={77} />
        </div>
      )}

      {!reduceMotion &&
        BLOBS.map(b => (
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
