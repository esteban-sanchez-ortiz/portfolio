import { createContext, useContext } from 'react'
export type Language = 'es' | 'en'
export const LanguageContext = createContext<Language>('en')
export const useLanguage = () => useContext(LanguageContext)
export const languageFromPath = (path: string): Language => /\/es(?:\/|$)/.test(path) ? 'es' : 'en'
export const PAGE_PATHS = ['', 'experience', 'projects', 'about', 'contact'] as const
export function pageFromPath(path: string) {
  const last = path.replace(/\/$/, '').split('/').pop() ?? ''
  return PAGE_PATHS.includes(last as typeof PAGE_PATHS[number]) ? last : ''
}
