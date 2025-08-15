import { motion } from 'framer-motion'

import { type CardProjectProps } from './CardProject.types'

export const CardProject = ({ project }: CardProjectProps) => {
  if (project.soon) {
    return (
      <div
        className="
          group relative overflow-hidden rounded-2xl
          border border-neutral-200 dark:border-zinc-800/60
          bg-white/70 dark:bg-zinc-950/60
          backdrop-blur-sm
        "
      >
        <div
          className="
            aspect-[16/10] w-full
            bg-[radial-gradient(circle_at_30%_20%,#e5e5e5_0%,#f4f4f5_60%)]
            dark:bg-[radial-gradient(circle_at_30%_20%,#3f3f46_0%,#18181b_60%)]
          "
        />
        <div className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-zinc-200">
            {project.title}
          </h3>
          <p className="mt-2 text-neutral-600 dark:text-zinc-500">{project.blurb}</p>
          <div
            className="
              mt-6 h-9 w-24 grid place-items-center rounded-full border border-dashed
              border-neutral-400 dark:border-zinc-700/80
              text-xs text-neutral-500 dark:text-zinc-500
            "
          >
            Soon
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="
        group relative overflow-hidden rounded-2xl
        border border-neutral-200 dark:border-zinc-800/60
        bg-white/70 dark:bg-zinc-900/40
        backdrop-blur-sm
      "
    >
      {project.image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={project.image}
            alt={`${project.title} cover`}
            loading="lazy"
            className="
              h-full w-full object-cover transition duration-500
              saturate-100 brightness-100
              group-hover:scale-[1.02] group-hover:saturate-110
              dark:saturate-90 dark:brightness-95
            "
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{project.title}</h3>
        <p className="mt-2 text-neutral-700 dark:text-zinc-400">{project.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech.map(t => (
            <li
              key={t.name}
              className="
                inline-flex items-center gap-2 rounded-full
                border border-neutral-300 dark:border-zinc-700/70
                bg-neutral-100/70 dark:bg-black/40
                px-3 py-1 text-xs
                text-neutral-700 dark:text-zinc-300
              "
            >
              {t.icon ? <t.icon className="h-4 w-4" /> : null}
              {t.name}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex items-center justify-center rounded-full
                bg-neutral-900 dark:bg-white
                px-4 py-2 text-sm font-medium
                text-white dark:text-black
                hover:opacity-90 transition-colors
              "
            >
              Live Demo
            </a>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex items-center justify-center rounded-full
                border border-neutral-300 dark:border-zinc-700
                px-4 py-2 text-sm font-medium
                text-neutral-700 dark:text-zinc-200
                hover:bg-neutral-100 dark:hover:bg-zinc-800/60
                transition-colors
              "
            >
              View Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
