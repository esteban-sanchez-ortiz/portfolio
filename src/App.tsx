import { useEffect } from 'react'

import { useKonamiConfetti } from '@hooks'
import {
  Banner,
  Hero,
  WorkExperience,
  Projects,
  Background,
  Speech,
  Education,
  CTA,
  Footer,
} from '@sections'

function App() {
  useEffect(() => {
    const title = 'Hi, curious dev 👋'
    const subtitle = 'What are you doing on my console? Stay curious. 👀'
    const s1 = 'font-weight:700;font-size:28px;line-height:1.2'
    const s2 = 'font-size:12px;opacity:.8'
    console.log('%c' + title, s1)
    console.log('%c' + subtitle, s2)
  }, [])
  useKonamiConfetti()

  return (
    <div className="dark:bg-black egg">
      <Background />
      <div className="relative z-10">
        <Banner />
        <Hero
          line1="Hi, I'm Esteban — Software Developer"
          line2="crafting high-performance, accessible UIs with React & TypeScript."
          highlight="React & TypeScript"
          imgSrc="yo.png"
          imgAlt="Esteban portrait"
        />
        <WorkExperience />
        <Projects />
        <Speech />
        <Education />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}

export default App
