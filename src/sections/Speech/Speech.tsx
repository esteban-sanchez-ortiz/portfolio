import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { aboutData } from '@data'

export const Speech = memo(() => {
  const content = useMemo(() => {
    const parts = [aboutData.intro]
    aboutData.highlights.forEach((highlight, idx) => {
      parts.push(highlight.text)
      if (idx === 0) parts.push(', crafting ')
      else if (idx === 1) parts.push(' and building ')
    })
    parts.push(aboutData.closing)
    return parts
  }, [])

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
          aboutData.highlights.some(h => h.text === part) ? (
            <span
              key={i}
              className="
                px-3 py-0 rounded-full inline-block my-1
                bg-neutral-200 text-neutral-900
                dark:bg-neutral-800 dark:text-white
              "
            >
              {part}
            </span>
          ) : (
            <span key={i} className="text-neutral-900 dark:text-white">
              {part}
            </span>
          )
        )}
      </motion.div>
    </section>
  )
})
