import { defineConfig } from 'vite'

import pkg from './package.json'
const buildDate = Date()

const headerLong = `/*!
* ${pkg.name} - ${pkg.description}
* @version ${pkg.version}
* ${pkg.homepage}
*
* @copyright ${pkg.author.name}
* @license ${pkg.license}
*
* BUILT: ${buildDate}
*/;`

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/svg.draggable.js',
      name: 'SVG',
      formats: ['umd'],
      fileName: () => `svg.draggable.js`,
    },
    rollupOptions: {
      output: {
        globals: {
          '@svgdotjs/svg.js': 'SVG',
        },
        banner: headerLong,
      },
      external: ['@svgdotjs/svg.js'],
    },
  },
})
