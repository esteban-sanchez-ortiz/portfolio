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
const MAX_ATTEMPTS = 2
const RETRY_DELAY_MS = 4000

type AttemptResult = 'done' | 'retryable' | 'rate_limited' | 'fatal'

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

      const controller = new AbortController()
      abortRef.current = controller

      const attempt = async (): Promise<AttemptResult> => {
        let gotDelta = false
        try {
          const res = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({ messages: history.slice(-MAX_HISTORY) }),
          })

          if (!res.ok || !res.body) {
            if (res.status === 429) return 'rate_limited'
            return res.status === 502 ? 'retryable' : 'fatal'
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
                if (parsed.delta) {
                  gotDelta = true
                  appendDelta(parsed.delta)
                }
                if (parsed.error) return gotDelta ? 'fatal' : 'retryable'
              } catch {
                // ignore malformed SSE fragments
              }
            }
          }
          return 'done'
        } catch (err) {
          if ((err as Error).name === 'AbortError') return 'done'
          return gotDelta ? 'fatal' : 'retryable'
        }
      }

      const fail = (kind: Exclude<SanchoError, null>) => {
        setMessages(prev => (prev[prev.length - 1]?.content === '' ? prev.slice(0, -1) : prev))
        setError(kind)
        setStatus('error')
      }

      for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        const result = await attempt()
        if (result === 'done') {
          setStatus('idle')
          return
        }
        const retryable = result === 'retryable' || result === 'rate_limited'
        if (i < MAX_ATTEMPTS && retryable) {
          // Quiet backoff: the thinking indicator keeps pulsing meanwhile.
          await new Promise(r => setTimeout(r, RETRY_DELAY_MS))
          continue
        }
        fail(result === 'rate_limited' ? 'rate_limited' : 'unavailable')
        return
      }
    },
    [messages, status],
  )

  return { messages, status, error, send }
}
