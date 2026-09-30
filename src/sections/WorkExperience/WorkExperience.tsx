import { useLanguage } from '../../i18n/Language'

import { ExperienceItem } from '@components'

const EXPERIENCE = [
  {
    role: 'Front‑End Software Analyst',
    company: 'Bearing AI',
    period: '2022 – 2025',
    location: 'Medellín',
    summary:
      'Modular UI architecture for a maritime analytics platform, E2E automation with Playwright, and React performance optimization.',
    bullets: [
      'Automated end-to-end testing with Playwright',
      'Shipped React + TS + Tailwind components library',
    ],
    image: 'bearingai.svg',
    url: 'https://bearing.ai',
  },
  {
    role: 'Front‑End Software Analyst',
    company: 'Perficient',
    period: '2021',
    location: 'Medellín',
    summary:
      'Maintained and evolved a multi‑tenant education platform focusing on stability and performance.',
    bullets: ['Multi-tenant application maintenance', 'GraphQL + CI/CD improvements'],
    image: 'perficient.svg',
    url: 'https://www.perficient.com/',
  },
  {
    role: 'Front‑End Developer',
    company: 'Appinit',
    period: '2020 – 2021',
    location: 'Medellín',
    summary:
      'Launched logistics and credit apps; led frontend and supported APIs for better performance.',
    bullets: ['Application performance improvements', 'Angular + JS + C# stack'],
    image: 'appinit.svg',
    url: 'https://appinit.co/',
  },
  {
    role: 'Software Developer',
    company: 'Solutto Consulting',
    period: '2019 – 2020',
    location: 'Medellín',
    summary:
      'Built and deployed hybrid mobile apps for academic platforms.',
    bullets: [
      'Developed hybrid mobile apps with Ionic & JavaScript',
      'Handled deployment to mobile platforms',
    ],
    image: 'solutto.webp',
    url: 'https://soluttoconsulting.com',
  },
]

export const WorkExperience = () => {
  const es = useLanguage() === 'es'
  const translations = [
    ['Analista de software frontend', 'Arquitectura de interfaces para analítica marítima, automatización con Playwright y optimización de React.', ['Pruebas de extremo a extremo con Playwright', 'Componentes con React, TypeScript y Tailwind']],
    ['Analista de software frontend', 'Mantenimiento de una plataforma educativa multiempresa, con foco en estabilidad y rendimiento.', ['Mantenimiento de aplicaciones multiempresa', 'Mejoras en GraphQL e integración continua']],
    ['Desarrollador frontend', 'Aplicaciones de logística y crédito; desarrollo frontend y apoyo a APIs.', ['Mejoras de rendimiento', 'Angular, JavaScript y C#']],
    ['Desarrollador de software', 'Desarrollo y despliegue de aplicaciones móviles híbridas para plataformas académicas.', ['Aplicaciones híbridas con Ionic y JavaScript', 'Despliegue en plataformas móviles']],
  ] as const
  const experience = EXPERIENCE.map((item, i) => es ? { ...item, role: translations[i][0], summary: translations[i][1], bullets: [...translations[i][2]] } : item)
  return (
    <section className="relative w-full">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 px-4 md:grid-cols-[0.9fr_1.4fr]">
        <header className="pb-6 md:pb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-zinc-100">
            {es ? 'Experiencia profesional' : 'Work experience'}
          </h2>
          <p className="mt-3 max-w-sm text-neutral-700 dark:text-zinc-400">
            {es ? 'Roles con foco en interfaces web, APIs y pruebas de extremo a extremo.' : 'Roles focused on web interfaces, APIs and end-to-end testing.'}
          </p>
        </header>

        <div className="relative">
          <div className="absolute -left-6 top-0 hidden h-full w-px md:block bg-gradient-to-b from-transparent via-neutral-300/50 dark:via-white/10 to-transparent" />
          <ul
            className="
            divide-y divide-neutral-200 dark:divide-white/5
            rounded-2xl border border-neutral-200 dark:border-white/5
            bg-white/60 dark:bg-zinc-900/40
            backdrop-blur-sm
            p-2 md:p-3
          "
          >
            {experience.map(item => (
              <ExperienceItem key={item.company} {...item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
