import { useEffect } from 'react'
import { Route, Router, Switch } from 'wouter'

import {
  HomePage,
  ExperiencePage,
  ProjectsPage,
  AboutPage,
  ContactPage,
} from './pages'

import { useKonamiConfetti } from '@hooks'
import { Banner, Background } from '@sections'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

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
    <Router base={BASE}>
      <div className="dark:bg-black egg">
        <Background />
        <div className="relative z-10">
          <Banner />
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/experience" component={ExperiencePage} />
            <Route path="/projects" component={ProjectsPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            <Route component={HomePage} />
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App
