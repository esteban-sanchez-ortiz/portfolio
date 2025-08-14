import type { SocialLinkProps } from './SocialLink.types'

export const SocialLink = ({ href, label, children }: SocialLinkProps) => {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer noopener"
      className="group inline-flex h-9 w-9 items-center justify-center rounded
        text-zinc-900 dark:text-zinc-100
        hover:bg-zinc-50 dark:hover:bg-zinc-800
        hover:text-emerald-500 transition"
    >
      {children}
    </a>
  )
}
