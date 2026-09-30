import { useEffect, type ReactNode } from 'react'

import { Footer } from '@sections'

interface PageProps {
  title: string
  children: ReactNode
}

/** Shared shell for content pages: document title, scroll reset, footer. */
export const Page = ({ title, children }: PageProps) => {
  useEffect(() => {
    document.title = `${title} · Esteban Sánchez`
    window.scrollTo(0, 0)
  }, [title])

  return (
    <>
      <main id="main" tabIndex={-1} className="min-h-[70vh]"><h1 className="sr-only">{title}</h1>{children}</main>
      <Footer />
    </>
  )
}
