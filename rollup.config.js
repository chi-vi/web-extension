import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import css from 'rollup-plugin-css-only'
import scss from 'rollup-plugin-scss'
import copy from 'rollup-plugin-copy'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: 'src/popup.js',
    output: {
      sourcemap: false,
      format: 'iife',
      name: 'popup',
      file: 'build/popup.js',
    },
    plugins: [
      svelte({ compilerOptions: { dev: !production } }),
      css({ output: 'popup.css' }),
      resolve({ browser: true, dedupe: ['svelte'] }),
      commonjs(),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/injection.js',
    output: {
      sourcemap: false,
      format: 'iife',
      name: 'injection',
      file: 'build/injection.js',
    },
    plugins: [
      copy({
        targets: [
          {
            src: ['public/*', 'build/*'],
            dest: ['firefox-ext', 'chromium-ext'],
          },
          {
            src: 'src/manifest-v2.json',
            dest: 'firefox-ext',
            rename: 'manifest.json',
          },
          {
            src: 'src/manifest-v3.json',
            dest: 'chromium-ext',
            rename: 'manifest.json',
          },
        ],
      }),
      resolve(),
      commonjs(),
      production && terser(),
    ],
    watch: { clearScreen: false },
  },
  {
    input: 'src/injection.scss',
    output: { sourcemap: false, file: 'public/injection.css' },
    plugins: [scss({ output: 'build/injection.css' })],
    watch: { clearScreen: false },
  },
]
