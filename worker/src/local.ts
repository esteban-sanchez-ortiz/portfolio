import worker from './index'
// Local development only: keep rate-limit state in this process, never in Cloudflare.
const counts = new Map<string, { window: number; count: number }>()
export default {
  fetch(request: Parameters<typeof worker.fetch>[0], env: Env, ctx: ExecutionContext) {
    const localLimiter = {
      async limit({ key }: { key: string }) {
        const window = Math.floor(Date.now() / 60000)
        const state = counts.get(key)
        const count = state?.window === window ? state.count + 1 : 1
        counts.set(key, { window, count })
        return { success: count <= 12 }
      },
    }
    return worker.fetch(request, { ...env, RATE_LIMITER: localLimiter } as Env, ctx)
  },
} satisfies ExportedHandler<Env>
