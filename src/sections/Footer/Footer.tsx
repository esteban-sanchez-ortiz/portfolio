import { memo } from 'react'
import { personalData } from '@data'

export const Footer = memo(() => {
  return (
    <footer className="py-6 text-neutral-700 dark:text-white">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-80">
        <p>© {new Date().getFullYear()} {personalData.name} — One turn at a time.</p>
        <a
          href={personalData.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-neutral-800 dark:text-white"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  )
})
