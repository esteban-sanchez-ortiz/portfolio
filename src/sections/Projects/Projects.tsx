import { CardProject, Icons } from '@components'
import { type Project } from '@components'

const PROJECTS: Project[] = [
  {
    title: 'Grantly',
    blurb: 'Data-permissions platform with points and real‑time notifications.',
    image: 'liquid1.jpg',
    tech: [
      { name: 'React', icon: Icons.React },
      { name: 'TypeScript', icon: Icons.Typescript },
      { name: 'Node.js', icon: Icons.Nodejs },
      { name: 'Tailwind CSS', icon: Icons.Tailwindcss },
    ],
    demoUrl: 'https://autorizo-fe-production.up.railway.app/login',
    codeUrl: 'https://github.com/autorizo/grantly',
  },
  { title: 'Next case study', blurb: 'Coming soon', tech: [], soon: true },
]

export const Projects = () => {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-4 py-16">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Selected Work</h2>
        <p className="mt-2 text-zinc-400">
          A quick snapshot of what I build. More projects on the way.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map(p => (
          <CardProject key={p.title} project={p} />
        ))}
      </div>
    </section>
  )
}
