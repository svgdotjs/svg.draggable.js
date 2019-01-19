import babel from 'rollup-plugin-babel'
import * as pkg from '../package.json'
import filesize from 'rollup-plugin-filesize'
// import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

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

const headerShort = `/*! ${pkg.name} v${pkg.version} ${pkg.license}*/;`

const getBabelConfig = (targets, corejs = false) => babel({
  include: 'src/**',
  runtimeHelpers: true,
  babelrc: false,
  presets: [['@babel/preset-env', {
    modules: false,
    targets: targets || pkg.browserslist,
    //useBuiltIns: 'usage'
  }]],
  plugins: [['@babel/plugin-transform-runtime', {
    corejs: corejs,
    helpers: true,
    useESModules: true
  }]]
})

// When few of these get mangled nothing works anymore
// We loose literally nothing by let these unmangled
const classes = [

]

const config = (node, min) => ({
  external: ['@svgdotjs/svg.js'],
  input: 'src/svg.draggable.js',
  output: {
    file: node ? './dist/svg.draggable.node.js'
      : min ? './dist/svg.draggable.min.js'
        : './dist/svg.draggable.js',
    format: node ? 'cjs' : 'iife',
    //name: 'SVG.Filter',
    sourcemap: true,
    banner: headerLong,
    // remove Object.freeze
    freeze: false,
    globals: {
      '@svgdotjs/svg.js': 'SVG',
    },
  },
  treeshake: {
    // property getter have no sideeffects
    propertyReadSideEffects: false
  },
  plugins: [
    resolve(),
    commonjs(),
    getBabelConfig(node && 'maintained node versions'),
    filesize(),
    !min ? {} : uglify({
      mangle: {
        reserved: classes
      },
      output: {
        preamble: headerShort
      }
    })
  ]
})

// [node, minified]
const modes = [[false], [false, true]]

export default modes.map(m => config(...m))
