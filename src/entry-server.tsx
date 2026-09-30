import { renderToString } from 'react-dom/server'

import App from './App'
import type { Language } from './i18n/Language'
export const render = (path: string, lang: Language) => renderToString(<App path={path} lang={lang} />)
