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
      'Cut manual bug‑hunting by ~30% via Playwright suites',
      'Shipped React + TS + Tailwind components library',
    ],
    image: '/bearingai.svg',
    url: 'https://bearing.ai',
  },
  {
    role: 'Front‑End Software Analyst',
    company: 'Perficient',
    period: '2021',
    location: 'Medellín',
    summary:
      'Maintained and evolved a multi‑tenant education platform focusing on stability and performance.',
    bullets: ['3k+ users, 1k+ active accounts', 'GraphQL + CI/CD improvements'],
    image: '/perficient.svg',
    url: 'https://www.perficient.com/',
  },
  {
    role: 'Front‑End Developer',
    company: 'Appinit',
    period: '2020 – 2021',
    location: 'Medellín',
    summary:
      'Launched logistics and credit apps; led frontend and supported APIs for better performance.',
    bullets: ['~25% performance uplift', 'Angular + JS + C# stack'],
    image: '/appinit.svg',
    url: 'https://appinit.co/',
  },
  {
    role: 'Software Developer',
    company: 'Solutto Consulting',
    period: '2019 – 2020',
    location: 'Medellín',
    summary:
      'Built and deployed hybrid mobile apps for academic platforms, used by 1,000+ students and educators.',
    bullets: [
      'Developed hybrid mobile apps with Ionic & JavaScript',
      'Handled deployment to mobile platforms',
    ],
    image: '/solutto.webp',
    url: 'https://soluttoconsulting.com',
  },
]

export const WorkExperience = () => {
  return (
    <section className="relative w-full">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 px-4 md:grid-cols-[0.9fr_1.4fr]">
        <header className="pb-6 md:pb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100">
            Work Experience
          </h2>
          <p className="mt-3 max-w-sm text-zinc-400">
            A selection of roles where I focused on fast, scalable front‑ends, clean APIs, and solid
            E2E coverage.
          </p>
        </header>

        <div className="relative">
          <div className="absolute -left-6 top-0 hidden h-full w-px md:block bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <ul className="divide-y divide-white/5 rounded-2xl border border-white/5 bg-zinc-900/40 p-2 md:p-3">
            {EXPERIENCE.map(item => (
              <ExperienceItem key={item.company} {...item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
