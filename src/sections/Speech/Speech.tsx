import { motion } from 'framer-motion'

const HIGHLIGHTS = [
  { text: 'React & TypeScript', type: 'pill' },
  { text: 'high-performance UIs', type: 'pill' },
  { text: 'creative solutions', type: 'pill' },
]

export const Speech = () => {
  const content = [
    'I’m Esteban, a software developer focused on ',
    'React & TypeScript',
    ', crafting ',
    'high-performance UIs',
    ' and building ',
    'creative solutions',
    ' that blend design and functionality.',
  ]

  return (
    <section className="max-w-4xl mx-auto px-6 py-10 text-3xl leading-loose">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        {content.map((part, i) =>
          HIGHLIGHTS.some(h => h.text === part) ? (
            <span
              key={i}
              className="bg-neutral-800 text-white px-3 py-0 rounded-full inline-block my-1"
            >
              {part}
            </span>
          ) : (
            <span className="text-white" key={i}>
              {part}
            </span>
          )
        )}
      </motion.div>
    </section>
  )
}
