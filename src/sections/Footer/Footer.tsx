export const Footer = () => {
  return (
    <footer className="py-6 text-neutral-700 dark:text-white">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-80">
        <p>© {new Date().getFullYear()} Esteban Sánchez — One turn at a time.</p>
        <a
          href="https://www.linkedin.com/in/hikso/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-neutral-800 dark:text-white"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  )
}
