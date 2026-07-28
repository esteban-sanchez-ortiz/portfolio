import { useCallback, useEffect, useRef, useState } from 'react'

export interface SanchoMessage {
  role: 'user' | 'assistant'
  content: string
}

export type SanchoStatus = 'idle' | 'streaming' | 'error'
export type SanchoError = 'rate_limited' | 'unavailable' | null

const API_URL =
  (import.meta.env.VITE_SANCHO_API as string | undefined) ??
  'https://sancho-chat.esteban-sanchez-nt.workers.dev'

const MAX_HISTORY = 12
const MAX_CHARS = 2000

export function useSanchoChat() {
  const [messages, setMessages] = useState<SanchoMessage[]>([])
  const [status, setStatus] = useState<SanchoStatus>('idle')
  const [error, setError] = useState<SanchoError>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_CHARS)
      if (!text || status === 'streaming') return

      setError(null)
      setStatus('streaming')

      const history: SanchoMessage[] = [...messages, { role: 'user', content: text }]
      setMessages([...history, { role: 'assistant', content: '' }])

      const appendDelta = (delta: string) =>
        setMessages(prev => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.role === 'assistant') {
            next[next.length - 1] = { ...last, content: last.content + delta }
          }
          return next
        })

      const fail = (kind: Exclude<SanchoError, null>) => {
        setMessages(prev =>
          prev[prev.length - 1]?.content === '' ? prev.slice(0, -1) : prev,
        )
        setError(kind)
        setStatus('error')
      }

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ messages: history.slice(-MAX_HISTORY) }),
        })

        if (!res.ok || !res.body) {
          fail(res.status === 429 ? 'rate_limited' : 'unavailable')
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const payload = trimmed.slice(5).trim()
            if (payload === '[DONE]') continue
            try {
              const parsed = JSON.parse(payload) as { delta?: string; error?: string }
              if (parsed.delta) appendDelta(parsed.delta)
              if (parsed.error) {
                fail('unavailable')
                return
              }
            } catch {
              // ignore malformed SSE fragments
            }
          }
        }
        setStatus('idle')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') fail('unavailable')
      }
    },
    [messages, status],
  )

  return { messages, status, error, send }
}
