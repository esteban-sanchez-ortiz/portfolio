import { useEffect } from 'react'
import { Route, Router, Switch } from 'wouter'

import {
  HomePage,
  ExperiencePage,
  ProjectsPage,
  AboutPage,
  ContactPage,
} from './pages'
import { LanguageContext, type Language } from './i18n/Language'

import { useKonamiConfetti } from '@hooks'
import { Banner, Background } from '@sections'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function App({ lang = 'en', path }: { lang?: Language; path?: string }) {
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
    <LanguageContext.Provider value={lang}>
    <Router base={`${BASE}/${lang}`} ssrPath={path}>
      <div className="dark:bg-black egg">
        <Background />
        <div className="relative z-10">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:bg-white focus:p-3">{lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
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
    </LanguageContext.Provider>
  )
}

export default App
