import { readFileSync } from 'node:fs'

import { defineConfig } from 'vite'

import pkg from './package.json' with { type: 'json' }

const buildDate = new Date().toISOString()

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

const types = readFileSync('svg.draggable.js.d.ts', 'utf8')
let emitted = false

const distExtras = {
  name: 'dist-extras',
  generateBundle() {
    if (emitted) return
    emitted = true

    // Without this node reads dist/*.js as esm and the umd wrapper falls
    // through to its global branch instead of module.exports.
    this.emitFile({
      type: 'asset',
      fileName: 'package.json',
      source: JSON.stringify({ type: 'commonjs' }, null, 2) + '\n'
    })

    // One maintained declaration, copied for both module formats.
    this.emitFile({
      type: 'asset',
      fileName: 'svg.draggable.d.mts',
      source: types
    })
    this.emitFile({
      type: 'asset',
      fileName: 'svg.draggable.d.ts',
      source: types
    })
  }
}

export default defineConfig({
  plugins: [distExtras],
  build: {
    lib: {
      entry: 'src/svg.draggable.js',
      name: 'SVG'
    },
    rollupOptions: {
      external: ['@svgdotjs/svg.js'],
      output: [
        {
          format: 'umd',
          name: 'SVG',
          entryFileNames: 'svg.draggable.js',
          globals: { '@svgdotjs/svg.js': 'SVG' },
          banner: headerLong,
          minify: true,
          // without this the minifier drops the banner
          comments: { legal: true }
        },
        // Must stay esm, so it resolves svg.js through the same import
        // condition the consumer used.
        {
          format: 'es',
          entryFileNames: 'svg.draggable.mjs',
          banner: headerLong,
          minify: false
        }
      ]
    }
  }
})
