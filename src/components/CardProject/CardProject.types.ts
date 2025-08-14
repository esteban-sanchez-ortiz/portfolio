import type { ComponentType, SVGProps } from 'react'

type Tech = {
  name: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export type Project = {
  title: string
  blurb: string
  image?: string
  tech: Tech[]
  demoUrl?: string
  codeUrl?: string
  soon?: boolean
}

export type CardProjectProps = {
  project: Project
}
