import { useLanguage } from '../../i18n/Language'
export const Speech = () => {
  const es = useLanguage() === 'es'
  const services = es ? [
    ['Aplicaciones web', 'Interfaces con React y TypeScript, y APIs con Node.js o Python.'],
    ['Automatización y pruebas', 'Flujos de trabajo y pruebas de extremo a extremo con Playwright.'],
    ['Integraciones', 'Conectar APIs y herramientas para reducir tareas manuales.'],
  ] : [
    ['Web applications', 'React and TypeScript interfaces, and APIs with Node.js or Python.'],
    ['Automation and testing', 'Workflow automation and end-to-end testing with Playwright.'],
    ['Integrations', 'Connect APIs and tools to reduce manual work.'],
  ]
  return <section className="mx-auto max-w-4xl px-6 py-10 text-neutral-900 dark:text-white">
    <p className="text-center text-2xl leading-relaxed">{es ? 'Soy Esteban Sánchez Ortiz, desarrollador fullstack en Colombia. Trabajo en español e inglés fluido. Disponible para contratos parciales y proyectos de software o automatización.' : 'I’m Esteban Sánchez Ortiz, a fullstack developer in Colombia. I work in Spanish and fluent English. Available for part-time contracts and software or automation projects.'}</p>
    <div className="mt-8 grid gap-4 md:grid-cols-3">{services.map(([title, text]) => <article key={title} className="rounded-2xl border border-neutral-200 p-5 dark:border-white/10"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">{text}</p></article>)}</div>
  </section>
}
