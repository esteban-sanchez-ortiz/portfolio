/** Local previews never call the public Worker automatically. */
export const API_URL = (import.meta.env.VITE_SANCHO_API as string | undefined) ??
  (typeof window !== 'undefined' && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
    ? 'http://localhost:8787'
    : 'https://sancho-chat.esteban-sanchez-nt.workers.dev')
