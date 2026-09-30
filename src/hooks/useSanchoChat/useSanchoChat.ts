import { useCallback, useEffect, useRef, useState } from 'react'

import { API_URL } from '../../api'
import { useLanguage } from '../../i18n/Language'

import { readSanchoStream } from './readSanchoStream'

export interface SanchoMessage { role: 'user' | 'assistant'; content: string }
export type SanchoStatus = 'idle' | 'streaming' | 'error'
export type SanchoError = 'rate_limited' | 'unavailable' | null


export function useSanchoChat() {
  const lang = useLanguage()
  const [messages, setMessages] = useState<SanchoMessage[]>([])
  const [status, setStatus] = useState<SanchoStatus>('idle')
  const [error, setError] = useState<SanchoError>(null)
  const abortRef = useRef<AbortController | null>(null)
  const failedHistory = useRef<SanchoMessage[] | null>(null)
  useEffect(() => () => abortRef.current?.abort(), [])

  const run = useCallback(async (history: SanchoMessage[]) => {
    if (abortRef.current) return
    const controller = new AbortController()
    abortRef.current = controller
    setError(null)
    setStatus('streaming')
    setMessages([...history, { role: 'assistant', content: '' }])
    let kind: SanchoError = 'unavailable'
    let success = false
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ messages: history.slice(-12), lang }),
      })
      if (res.status === 429) kind = 'rate_limited'
      if (res.ok && res.body) success = await readSanchoStream(res.body, delta => setMessages(prev => {
        const last = prev[prev.length - 1]
        return last?.role === 'assistant' ? [...prev.slice(0, -1), { ...last, content: last.content + delta }] : prev
      }))
    } catch { /* The Worker owns bounded failover. No automatic client retry multiplies provider calls. */ }
    finally { abortRef.current = null }
    if (controller.signal.aborted) return
    if (success) { failedHistory.current = null; setStatus('idle'); return }
    failedHistory.current = history
    setMessages(prev => prev[prev.length - 1]?.content === '' ? prev.slice(0, -1) : prev)
    setError(kind)
    setStatus('error')
  }, [lang])

  const send = useCallback((raw: string) => {
    const text = raw.trim().slice(0, 2000)
    if (!text || abortRef.current) return
    return run([...messages, { role: 'user', content: text }])
  }, [messages, run])
  const retry = useCallback(() => {
    if (failedHistory.current) return run(failedHistory.current)
  }, [run])
  return { messages, status, error, send, retry }
}
