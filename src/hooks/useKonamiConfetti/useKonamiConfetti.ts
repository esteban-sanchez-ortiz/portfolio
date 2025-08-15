import { useCallback, useRef } from 'react'

import { useKonami } from '../useKonami'

function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export function useKonamiConfetti() {
  const last = useRef(0)
  const reduced = usePrefersReducedMotion()
  const trigger = useCallback(async () => {
    const now = Date.now()
    if (now - last.current < 1500) return
    last.current = now

    if (reduced) {
      document.documentElement.classList.toggle('egg')
      return
    }

    const { default: confetti } = await import('canvas-confetti')

    const duration = 900
    const end = Date.now() + duration

    ;(function frame() {
      confetti({
        particleCount: 4,
        startVelocity: 55,
        spread: 55,
        angle: 60,
        origin: { x: 0, y: 0.7 },
      })
      confetti({
        particleCount: 4,
        startVelocity: 55,
        spread: 55,
        angle: 120,
        origin: { x: 1, y: 0.7 },
      })

      if (Date.now() < end) requestAnimationFrame(frame)
    })()

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      scalar: 0.9,
      ticks: 200,
    })
  }, [reduced])

  useKonami(trigger)
}
