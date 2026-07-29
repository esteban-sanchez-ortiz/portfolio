import { useEffect } from 'react'

import { Page } from './Page'

import { Hero, WorkExperience, Projects, Speech, Education, CTA } from '@sections'

export const HomePage = () => {
  useEffect(() => {
    document.title = 'Esteban Sánchez · Ask Sancho'
  }, [])

  return (
    <main>
      <Hero
        line1="Hi, I'm Esteban, Software Developer"
        line2="crafting high-performance, accessible UIs with React & TypeScript."
        highlight="React & TypeScript"
        imgSrc={`${import.meta.env.BASE_URL}yo.png`}
        imgAlt="Esteban portrait"
      />
    </main>
  )
}

export const ExperiencePage = () => (
  <Page title="Experience">
    <WorkExperience />
  </Page>
)

export const ProjectsPage = () => (
  <Page title="Projects">
    <Projects />
  </Page>
)

export const AboutPage = () => (
  <Page title="About">
    <Speech />
    <Education />
  </Page>
)

export const ContactPage = () => (
  <Page title="Contact">
    <CTA />
  </Page>
)
