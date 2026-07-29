import { useState } from 'react'
import { Link, useLocation } from 'wouter'

const LINKS = [
  { href: '/', label: 'Chat' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

export const NavMenu = () => {
  const [location] = useLocation()
  const [open, setOpen] = useState(false)

  const linkClass = (href: string) =>
    [
      'text-sm transition hover:text-zinc-900 dark:hover:text-white',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-roulette-teal rounded',
      location === href
        ? 'font-medium text-zinc-900 underline decoration-roulette-teal decoration-2 underline-offset-8 dark:text-white'
        : 'text-zinc-500 dark:text-zinc-400',
    ].join(' ')

  return (
    <nav aria-label="Main">
      {/* Desktop */}
      <ul className="hidden items-center gap-5 md:flex">
        {LINKS.map(l => (
          <li key={l.href}>
            <Link href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile */}
      <button
        type="button"
        aria-expanded={open}
        aria-label="Menu"
        onClick={() => setOpen(o => !o)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg
                   transition hover:bg-zinc-100 dark:hover:bg-white/10 md:hidden
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-roulette-teal"
      >
        <span
          className={`h-0.5 w-5 rounded bg-zinc-700 transition-transform dark:bg-zinc-200 ${
            open ? 'translate-y-2 rotate-45' : ''
          }`}
        />
        <span
          className={`h-0.5 w-5 rounded bg-zinc-700 transition-opacity dark:bg-zinc-200 ${
            open ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`h-0.5 w-5 rounded bg-zinc-700 transition-transform dark:bg-zinc-200 ${
            open ? '-translate-y-2 -rotate-45' : ''
          }`}
        />
      </button>

      {open && (
        <ul
          className="absolute inset-x-0 top-full flex flex-col border-b border-zinc-200 bg-white/95
                     backdrop-blur dark:border-zinc-800 dark:bg-black/90 md:hidden"
        >
          {LINKS.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block px-6 py-3.5 ${linkClass(l.href)}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
