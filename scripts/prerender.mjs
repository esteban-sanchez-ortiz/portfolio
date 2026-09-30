import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { render } from '../.prerender/entry-server.js'
const origin = 'https://esteban-sanchez-ortiz.github.io'
const base = '/portfolio/'
const pages = ['', 'experience', 'projects', 'about', 'contact']
const labels = { es: ['Software y automatización', 'Experiencia', 'Proyectos', 'Sobre mí y servicios', 'Contacto'], en: ['Software & automation', 'Experience', 'Projects', 'About & services', 'Contact'] }
const template = await readFile('dist/index.html', 'utf8')
const description = { es: 'Esteban Sánchez Ortiz, desarrollador fullstack en Colombia. React, TypeScript, Node, Python y automatización con Playwright. Contratos parciales y proyectos.', en: 'Esteban Sánchez Ortiz, fullstack developer in Colombia. React, TypeScript, Node, Python and Playwright automation. Part-time contracts and projects.' }
const href = (lang, page) => `${origin}${base}${lang}/${page ? page + '/' : ''}`
let entries = []
for (const lang of ['en', 'es']) for (const [i, page] of pages.entries()) {
 const path = `${base}${lang}/${page ? page + '/' : ''}`
 const canonical = href(lang, page)
 const title = `Esteban Sánchez Ortiz · ${labels[lang][i]}`
 const alternates = ['en', 'es'].map(l => `<link rel="alternate" hreflang="${l}" href="${href(l,page)}" />`).join('') + `<link rel="alternate" hreflang="x-default" href="${href('en',page)}" />`
 const schema = ['', 'about'].includes(page) ? `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'ProfilePage',url:canonical,mainEntity:{'@type':'Person',name:'Esteban Sánchez Ortiz',jobTitle:lang==='es'?'Desarrollador fullstack':'Fullstack developer',url:href(lang,''),sameAs:['https://github.com/esteban-sanchez-ortiz','https://www.linkedin.com/in/esteban-sanchez-ortiz']}})}</script>` : ''
 const head = `<title>${title}</title><meta name="description" content="${description[lang]}" /><link rel="canonical" href="${canonical}" />${alternates}<meta property="og:type" content="website" /><meta property="og:title" content="${title}" /><meta property="og:description" content="${description[lang]}" /><meta property="og:url" content="${canonical}" /><meta property="og:locale" content="${lang==='es'?'es_CO':'en_US'}" />${schema}`
 const html = template.replace('<html lang="en">',`<html lang="${lang}">`).replace('<!--metadata-->',head).replace('<div id="root"></div>',`<div id="root">${render(path, lang)}</div>`)
 const directory = `dist/${lang}/${page}`
 await mkdir(directory,{recursive:true}); await writeFile(`${directory}/index.html`,html)
 if(lang==='en') { const legacyDir = `dist/${page}`; await mkdir(legacyDir,{recursive:true});await writeFile(`${legacyDir}/index.html`,html) }
 entries.push(`<url><loc>${canonical}</loc>${['en','es'].map(l=>`<xhtml:link rel="alternate" hreflang="${l}" href="${href(l,page)}" />`).join('')}</url>`)
}
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`)
console.log('Prerendered 10 localized routes and 5 legacy entry points')
