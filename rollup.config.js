const createBabelConfig = require('./babel.config.js')
const resolve = require('@rollup/plugin-node-resolve')
const babelPlugin = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const { dts } = require('rollup-plugin-dts')

const extensions = ['.ts', '.tsx']

function getBabelOptions() {
  return {
    ...createBabelConfig,
    extensions,
    babelHelpers: 'bundled',
    comments: false,
  }
}

function createDeclarationConfig(input, output) {
  return {
    input,
    output: {
      file: output,
      format: 'es',
    },
    plugins: [dts()],
  }
}

function createESMConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'esm' },
    plugins: [resolve({ extensions }), commonjs(), babelPlugin(getBabelOptions())],
  }
}

function createCommonJSConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'cjs' },
    plugins: [resolve({ extensions }), commonjs(), babelPlugin(getBabelOptions())],
  }
}

function createUMDConfig(input, output, name) {
  return {
    input,
    output: { file: output, format: 'umd', name },
    plugins: [resolve({ extensions }), commonjs(), babelPlugin(getBabelOptions())],
  }
}

module.exports = (args) => {
  const packageName = args.package

  const input = `packages/${packageName}`
  const output = `packages/${packageName}/dist`

  return [
    createDeclarationConfig(input, output),
    createESMConfig(`${input}/src/index.ts`, `${output}/index.mjs`),
    createCommonJSConfig(`${input}/src/index.ts`, `${output}/index.cjs.js`),
    createUMDConfig(`${input}/src/index.ts`, `${output}/index.umd.js`, packageName),
  ]
}
