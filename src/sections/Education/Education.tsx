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
      <h2 className="text-2xl font-bold mb-6">Education</h2>
      <div className="space-y-4">
        {EDUCATION.map((edu, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-neutral-900 text-white p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold">{edu.title}</h3>
            <p className="text-sm opacity-80">{edu.institution}</p>
            <span className="text-xs opacity-60">{edu.year}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
