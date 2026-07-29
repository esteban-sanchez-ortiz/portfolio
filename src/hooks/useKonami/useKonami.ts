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
      // Ignore keystrokes while typing in form fields (e.g. the Sancho chat input)
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return
      }

      buffer.push(e.code)
      if (buffer.length > seq.length) buffer.shift()

      if (buffer.length === seq.length && seq.every((s, i) => buffer[i] === s)) {
        onTrigger()
        buffer = []
      }
    }

    document.addEventListener('keydown', handler, { capture: true })
    return () => document.removeEventListener('keydown', handler, true)
  }, [onTrigger])
}
