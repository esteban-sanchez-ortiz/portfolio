import { useLanguage } from '../../i18n/Language'

export const CTA = () => {
  const es = useLanguage() === 'es'
  return (
    <section className="mx-auto max-w-3xl border-y border-neutral-300 px-6 py-12 dark:border-neutral-800 sm:py-16">
      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">{es ? 'Hablemos de tu proyecto' : 'Let’s discuss your project'}</h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-700 dark:text-zinc-400">{es ? '¿Necesitas desarrollar software o automatizar un proceso? Cuéntame qué quieres resolver y el alcance que tienes en mente.' : 'Need to build software or automate a process? Tell me what you want to solve and the scope you have in mind.'}</p>
      <a href="mailto:esteban.sanchez.nt@gmail.com" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-roulette-teal">{es ? 'Escríbeme por correo' : 'Email me'}<span aria-hidden>↗</span></a>
      <p className="mt-4 break-all text-sm text-neutral-600 dark:text-zinc-400">esteban.sanchez.nt@gmail.com</p>
    </section>
  )
}
