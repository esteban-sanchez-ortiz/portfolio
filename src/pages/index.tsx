import { useEffect } from 'react'

import { useLanguage } from '../i18n/Language'

import { Page } from './Page'

import { Hero, WorkExperience, Projects, Speech, CTA } from '@sections'

export const HomePage = () => {
  const es = useLanguage() === 'es'
  useEffect(() => {
    document.title = es ? 'Esteban Sánchez Ortiz · Software y automatización' : 'Esteban Sánchez Ortiz · Software & automation'
  }, [es])

  return (
    <main id="main" tabIndex={-1}>
      <Hero
        line1={es ? 'Soy Esteban Sánchez Ortiz, desarrollador fullstack' : 'I’m Esteban Sánchez Ortiz, a fullstack developer'}
        line2={es ? 'Software y automatización con React, TypeScript, Node y Python.' : 'Software and automation with React, TypeScript, Node and Python.'}
        highlight="React & TypeScript"
        imgSrc={`${import.meta.env.BASE_URL}portrait.png`}
        imgAlt={es ? 'Retrato de Esteban Sánchez Ortiz' : 'Portrait of Esteban Sánchez Ortiz'}
      />
    </main>
  )
}

export const ExperiencePage = () => <Page title={useLanguage() === 'es' ? 'Experiencia' : 'Experience'}><WorkExperience /></Page>
export const ProjectsPage = () => <Page title={useLanguage() === 'es' ? 'Proyectos' : 'Projects'}><Projects /></Page>
export const AboutPage = () => <Page title={useLanguage() === 'es' ? 'Sobre mí y servicios' : 'About & services'}><Speech /></Page>
export const ContactPage = () => <Page title={useLanguage() === 'es' ? 'Contacto' : 'Contact'}><CTA /></Page>
