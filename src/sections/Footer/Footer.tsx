export const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 py-6 text-white">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-70">
        <p>© {new Date().getFullYear()} Esteban Sánchez — One turn at a time.</p>
        <a
          href="https://www.linkedin.com/in/hikso/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  )
}
