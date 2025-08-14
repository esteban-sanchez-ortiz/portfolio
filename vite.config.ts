import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
        replaceAttrValues: {
          '#0A66C2': 'currentColor',
          '#0a66c2': 'currentColor',
          '#0077B5': 'currentColor',
          '#0077b5': 'currentColor',
          '#0076b2': 'currentColor',
          '#ffffff': 'currentColor',
          '#fff': 'currentColor',
          '#000000': 'currentColor',
          '#000': 'currentColor',
          white: 'currentColor',
          black: 'currentColor',
          'rgb(10,102,194)': 'currentColor',
          'rgb(255,255,255)': 'currentColor',
          'rgb(0,0,0)': 'currentColor',
        },
        svgo: true,
        svgoConfig: {
          plugins: ['preset-default', 'convertStyleToAttrs', 'convertColors', 'removeDimensions'],
        },
      },
    }),
    visualizer({ filename: 'stats.html', brotliSize: true, gzipSize: true }),
  ],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@sections': path.resolve(__dirname, 'src/sections'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  build: { target: 'es2020', cssCodeSplit: true, sourcemap: true },
  base: '/portfolio/',
})
