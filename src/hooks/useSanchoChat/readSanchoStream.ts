/** Only terminal, nonempty SSE replies are successful; partial replies are kept by the caller. */
export async function readSanchoStream(body: ReadableStream<Uint8Array>, onDelta: (text: string) => void): Promise<boolean> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let received = false
  let complete = false
  let failed = false
  const consume = (line: string) => {
    if (!line.trim().startsWith('data:')) return
    const payload = line.trim().slice(5).trim()
    if (payload === '[DONE]') { complete = true; return }
    const parsed = JSON.parse(payload) as { delta?: string; error?: string }
    if (parsed.error) { failed = true; return }
    if (typeof parsed.delta === 'string' && parsed.delta) { received = true; onDelta(parsed.delta) }
  }
  try {
    while (!complete && !failed) {
      const { done, value } = await reader.read()
      if (done) { buffer += decoder.decode(); if (buffer.trim()) consume(buffer); break }
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) { consume(line); if (complete || failed) break }
    }
    return complete && received && !failed
  } catch { return false }
  finally { await reader.cancel().catch(() => {}) }
}
