import { ExperienceItem } from '@components'
import { experienceData } from '@data'

export const WorkExperience = () => {
  return (
    <section className="relative w-full">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 px-4 md:grid-cols-[0.9fr_1.4fr]">
        <header className="pb-6 md:pb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-zinc-100">
            Work Experience
          </h2>
          <p className="mt-3 max-w-sm text-neutral-700 dark:text-zinc-400">
            A selection of roles where I focused on fast, scalable front-ends, clean APIs, and solid
            E2E coverage.
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
            {experienceData.map(item => (
              <ExperienceItem key={item.company} {...item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
