import { useMemo } from 'react'

import { mulberry32 } from './SparklesLayer.utils'

export const SparklesLayer = ({ count = 28, seed = 42 }: { count?: number; seed?: number }) => {
  const positions = useMemo(() => {
    const rnd = mulberry32(seed)
    return Array.from({ length: count }).map((_, i) => ({
      id: `s-${i}`,
      top: `${rnd() * 100}%`,
      left: `${rnd() * 100}%`,
      delay: `${(rnd() * 2).toFixed(2)}s`,
      dur: `${(2.2 + rnd() * 1.6).toFixed(2)}s`,
    }))
  }, [count, seed])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <style>
        {`
        @keyframes sparklePulse {
          0%,100% { transform: translateY(0); opacity: .35; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
      `}
      </style>
      {positions.map(p => (
        <div
          key={p.id}
          className="absolute h-1.5 w-1.5 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)] bg-green-400 dark:bg-green/70 [will-change:transform,opacity]"
          style={{
            top: p.top,
            left: p.left,
            animation: `sparklePulse ${p.dur} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}
