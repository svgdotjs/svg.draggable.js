import { readFileSync } from 'node:fs'

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

// Everything dist needs besides the bundles themselves, emitted once rather
// than per output format.
const types = readFileSync('svg.draggable.js.d.ts', 'utf8')
let emitted = false

const distExtras = {
  name: 'dist-extras',
  generateBundle() {
    if (emitted) return
    emitted = true

    // The umd build is perfectly good commonjs, but this package is "type":
    // "module", so node would parse dist/*.js as esm and the umd wrapper would
    // fall through to its global branch. A package.json inside dist flips the
    // folder back to commonjs so require() gets the umd file as intended.
    this.emitFile({
      type: 'asset',
      fileName: 'package.json',
      source: JSON.stringify({ type: 'commonjs' }, null, 2) + '\n',
    })

    // One maintained declaration file, copied for both module formats.
    // Typescript takes the format from the extension and the commonjs marker
    // above, so .d.mts describes the esm build and .d.ts the umd one.
    this.emitFile({
      type: 'asset',
      fileName: 'svg.draggable.d.mts',
      source: types,
    })
    this.emitFile({
      type: 'asset',
      fileName: 'svg.draggable.d.ts',
      source: types,
    })
  },
}

export default defineConfig({
  plugins: [distExtras],
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/svg.draggable.js',
      name: 'SVG',
      // umd for browsers, the cdns and require(); .mjs for import. The esm
      // build has to keep the .mjs extension because dist is marked commonjs
      // above, and it must stay esm so it resolves svg.js through the same
      // import condition the consumer used - a cjs copy of the plugin would
      // extend a second, unrelated Element
      formats: ['umd', 'es'],
      fileName: (format) =>
        format === 'es' ? 'svg.draggable.mjs' : 'svg.draggable.js',
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
