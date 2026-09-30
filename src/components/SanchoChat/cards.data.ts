export type CardKind = 'experience' | 'projects' | 'availability' | 'contact'

export const CARD_TOKEN_RE = /\[card:(experience|projects|availability|contact)\]/g

export const EXPERIENCE = [
  { company: 'Bearing AI', role: 'Front-End Engineer', period: '2022 - 2025', stack: 'React · TS · Playwright' },
  { company: 'Perficient', role: 'Front-End Developer', period: '2021', stack: 'React · GraphQL' },
  { company: 'Appinit', role: 'Front-End Developer', period: '2020 - 2021', stack: 'Angular · C#' },
] as const

export const PROJECTS = [
  {
    name: 'Grantly',
    desc: 'Personal data permission platform with points & rewards',
    stack: 'React · TS · Node · MySQL',
    href: 'https://github.com/autorizo/grantly',
  },
  {
    name: 'This portfolio',
    desc: 'Chat-first portfolio with an AI squire',
    stack: 'React 19 · Vite · Tailwind 4 · Workers',
    href: 'https://github.com/esteban-sanchez-ortiz/portfolio',
  },
] as const

export const AVAILABILITY = {
  tz: 'Colombia (UTC-5)',
  mode: 'Remote only',
} as const
