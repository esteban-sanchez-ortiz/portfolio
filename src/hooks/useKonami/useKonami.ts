import { useEffect } from 'react'

export function useKonami(onTrigger: () => void) {
  useEffect(() => {
    const seq = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'KeyB',
      'KeyA',
    ]
    let buffer: string[] = []

    const handler = (e: KeyboardEvent) => {
      const k = e.code
      buffer.push(k)
      if (buffer.length > seq.length) buffer.shift()

      if (buffer.length === seq.length && seq.some((s, i) => buffer[i] === s)) {
        onTrigger()
        buffer = []
      }
    }

    document.addEventListener('keydown', handler, { capture: true })
    return () => document.removeEventListener('keydown', handler, true)
  }, [onTrigger])
}
