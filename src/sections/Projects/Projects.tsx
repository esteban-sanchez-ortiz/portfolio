import { useLanguage } from '../../i18n/Language'

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
  {
    title: 'My Portfolio',
    blurb: 'Showcase of my work and projects.',
    image: 'liquid2.jpg',
    tech: [
      { name: 'React', icon: Icons.React },
      { name: 'TypeScript', icon: Icons.Typescript },
      { name: 'Vite', icon: Icons.Vite },
      { name: 'Tailwind CSS', icon: Icons.Tailwindcss },
    ],
    demoUrl: 'https://esteban-sanchez-ortiz.github.io/portfolio',
    codeUrl: 'https://github.com/esteban-sanchez-ortiz/portfolio',
  },
]

export const Projects = () => {
  const es = useLanguage() === 'es'
  const projects = PROJECTS.map((p, i) => es ? { ...p, title: i === 1 ? 'Mi portafolio' : p.title, blurb: i === 0 ? 'Plataforma de permisos de datos con puntos y notificaciones en tiempo real.' : 'Mi trabajo y proyectos, con un asistente conversacional.' } : p)
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-4 py-16">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          {es ? 'Proyectos' : 'Projects'}
        </h2>
        <p className="mt-2 text-neutral-700 dark:text-zinc-400">
          {es ? 'Una selección de mi trabajo. Consulta el código para conocer cada proyecto.' : 'A selection of my work. Explore the code to learn about each project.'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map(p => (
          <CardProject key={p.title} project={p} />
        ))}
      </div>
    </section>
  )
}
