import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import babel from '@rollup/plugin-babel'
import replace from 'rollup-plugin-replace'
import alias from '@rollup/plugin-alias'
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const pkg = require('./package.json')

const libraryName = 'lib-call-quality-monitoring'

const plugins = [
  // Allow json resolution
  json(),
  // Compile TypeScript files
  typescript({ useTsconfigDeclarationDir: true }),
  // Allow node_modules resolution, so you can use 'external' to control
  // which external modules to include in the bundle
  // https://github.com/rollup/rollup-plugin-node-resolve#usage
  resolve({ browser: true }),
  // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
  // The order is important: https://github.com/axios/axios/issues/1259
  commonjs(),
  // Resolve source maps to the original source
  sourceMaps(),
  // Server from dist
  serve({
    contentBase: ['dist'],
    openPage: '/',
    port: 8080
  }),

  livereload(),
  babel({
    presets: [["@babel/preset-react", { runtime: "automatic" }]],
  }),
  // replace ENV config in react : https://github.com/rollup/rollup/issues/487#issuecomment-177596512
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  alias({
    entries: [
      { find: 'react', replacement: 'preact/compat' },
      { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
      { find: 'react-dom', replacement: 'preact/compat' },
      { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
    ]
  })
]

export default [
  {
    input: 'src/browser.mjs',
    output: [
      {
        file: pkg.browser,
        format: 'iife'
      }
    ],
    plugins
  },
  {
    input: `src/${libraryName}.ts`,
    output: [
      { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**'
    },
    plugins
  }
]
