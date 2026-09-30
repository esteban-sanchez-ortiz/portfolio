import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { languageFromPath, pageFromPath } from './i18n/Language'

const lang = languageFromPath(location.pathname)
document.documentElement.lang = lang

const root = document.getElementById('root')!
const app = <StrictMode><App lang={lang} /></StrictMode>
if (!/\/(es|en)(?:\/|$)/.test(location.pathname)) {
  const page = pageFromPath(location.pathname)
  location.replace(`${import.meta.env.BASE_URL}en/${page ? page + '/' : ''}`)
} else if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
