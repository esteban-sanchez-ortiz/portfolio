import portfolioDataJson from './portfolio.json'
import { Icons } from '@components'
import type {
  PortfolioData,
  ProjectWithIcons,
  TechWithIcon,
  Experience,
  Education,
  PersonalInfo,
  AboutInfo,
  BrandStyles,
  BackgroundConfig,
} from './types'

// Type assertion for the imported JSON
const rawData = portfolioDataJson as PortfolioData

// Icon name to component mapping
const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  React: Icons.React,
  Typescript: Icons.Typescript,
  Javascript: Icons.Javascript,
  Tailwindcss: Icons.Tailwindcss,
  Nodejs: Icons.Nodejs,
  Playwright: Icons.Playwright,
  Jest: Icons.Jest,
  Graphql: Icons.Graphql,
  Postgresql: Icons.Postgresql,
  Docker: Icons.Docker,
  Git: Icons.Git,
  GithubActions: Icons.GithubActions,
  Vite: Icons.Vite,
}

// Helper function to resolve icon names to components
function resolveTechIcons(tech: { name: string; icon: string }[]): TechWithIcon[] {
  return tech.map(t => ({
    name: t.name,
    icon: iconMap[t.icon],
  }))
}

// Resolved data exports
export const personalData: PersonalInfo = rawData.personal

export const aboutData: AboutInfo = rawData.about

export const skillsData: TechWithIcon[] = resolveTechIcons(rawData.skills)

export const experienceData: Experience[] = rawData.experience

export const projectsData: ProjectWithIcons[] = rawData.projects.map(project => ({
  ...project,
  tech: resolveTechIcons(project.tech),
}))

export const educationData: Education[] = rawData.education

export const brandStyles: BrandStyles = rawData.brands

export const backgroundConfig: BackgroundConfig = rawData.background

// Export all data as a single object for convenience
export const portfolioData = {
  personal: personalData,
  about: aboutData,
  skills: skillsData,
  experience: experienceData,
  projects: projectsData,
  education: educationData,
  brands: brandStyles,
  background: backgroundConfig,
}

// Re-export types
export type * from './types'
