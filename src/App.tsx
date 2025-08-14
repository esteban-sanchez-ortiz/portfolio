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
  return (
    <div className="dark:bg-black">
      <Background />
      <div className="relative z-10">
        <Banner />
        <Hero
          line1="Hi, I'm Esteban — Software Developer"
          line2="crafting high-performance, accessible UIs with React & TypeScript."
          highlight="React & TypeScript"
          imgSrc="/yo.png"
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
