import { motion } from 'framer-motion'

const EDUCATION = [
  {
    title: 'Bachelor’s Degree in Computer Science',
    institution: 'Fundacion Universitaria Catolica del Norte',
    year: '2015 – 2020',
  },
  {
    title: 'English Language – Level B2',
    institution: '-',
    year: '2021',
  },
]

export const Education = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">Education</h2>
      <div className="space-y-4">
        {EDUCATION.map((edu, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="
              p-4 rounded-lg
              bg-white dark:bg-neutral-900
              text-neutral-900 dark:text-white
              border border-neutral-200 dark:border-neutral-800
              shadow-sm dark:shadow-none
            "
          >
            <h3 className="text-lg font-semibold">{edu.title}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">{edu.institution}</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{edu.year}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
