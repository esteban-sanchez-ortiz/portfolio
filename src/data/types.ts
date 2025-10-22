import type { ComponentType, SVGProps } from 'react'

// Icon reference type
export type IconName = string

// Tech skill type
export type Tech = {
  name: string
  icon: IconName
}

// Tech with resolved icon component (used after data loading)
export type TechWithIcon = {
  name: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

// Personal information
export type PersonalInfo = {
  name: string
  email: string
  location: string
  linkedin: string
  github: string
  availability: string
  heroImage: string
  heroImageWebp: string
}

// About section
export type Highlight = {
  text: string
  type: 'pill' | 'text'
}

export type AboutInfo = {
  intro: string
  highlights: Highlight[]
  closing: string
}

// Work experience
export type Experience = {
  role: string
  company: string
  period: string
  location: string
  summary: string
  bullets: string[]
  image: string
  url: string
}

// Project
export type Project = {
  title: string
  blurb: string
  image?: string
  tech: Tech[]
  demoUrl?: string
  codeUrl?: string
  soon?: boolean
}

// Project with resolved icons (used after data loading)
export type ProjectWithIcons = {
  title: string
  blurb: string
  image?: string
  tech: TechWithIcon[]
  demoUrl?: string
  codeUrl?: string
  soon?: boolean
}

// Education
export type Education = {
  title: string
  institution: string
  year: string
}

// Brand styling
export type BrandStyle = {
  accent: string
  mono?: boolean
  bgType?: 'light' | 'dark'
}

export type BrandStyles = Record<string, BrandStyle>

// Background animation
export type BlobAnimation = {
  id: string
  className: string
  animate: {
    x: number[]
    y: number[]
  }
  duration: number
}

export type BackgroundConfig = {
  blobs: BlobAnimation[]
  sparkles: {
    count: number
    seed: number
  }
}

// Root portfolio data structure
export type PortfolioData = {
  personal: PersonalInfo
  about: AboutInfo
  skills: Tech[]
  experience: Experience[]
  projects: Project[]
  education: Education[]
  brands: BrandStyles
  background: BackgroundConfig
}
