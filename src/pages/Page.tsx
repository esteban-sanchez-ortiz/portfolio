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
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  )
}
