import { CardProject } from '@components'
import { projectsData } from '@data'

export const Projects = () => {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-4 py-16">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Portfolio
        </h2>
        <p className="mt-2 text-neutral-700 dark:text-zinc-400">
          A quick snapshot of what I build. More projects on the way.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectsData.map(p => (
          <CardProject key={p.title} project={p} />
        ))}
      </div>
    </section>
  )
}
