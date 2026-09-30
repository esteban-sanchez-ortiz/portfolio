import { motion } from 'framer-motion'

import { useLanguage } from '../../i18n/Language'

import { Icons } from '@components'

export const CTA = () => {
  const es = useLanguage() === 'es'
  return (
    <motion.a
      href="mailto:esteban.sanchez.nt@gmail.com"
      initial={false}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-roulette-teal"
    >
      <section className="border-y border-neutral-300 dark:border-neutral-800 py-12">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-neutral-900 dark:text-white">
          <motion.h2
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-3xl font-bold"
          >
            {es ? 'Trabajemos ' : 'Let’s work '}<span className="text-neutral-600 dark:text-neutral-500">{es ? 'juntos.' : 'together.'}</span>
          </motion.h2>
          <div
            className="
  bg-emerald-600 dark:bg-neutral-600
  group-hover:bg-emerald-500 dark:group-hover:bg-neutral-500
  transition-colors rounded-full p-4 text-white
"
          >
            <Icons.Send className="w-5 h-5" />
          </div>
        </div>
      </section>
    </motion.a>
  )
}
