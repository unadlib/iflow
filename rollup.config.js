import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

const pgk = require('./package.json')
const env = process.env.NODE_ENV

const config = {
  input: 'lib/index.js',
  output: {
    name: pgk.name,
    exports: 'named'
  },
  plugins: [
    resolve(),
    babel({
      presets: [
        [
          'env',
          {
            'modules': false
          }
        ],
        'stage-0'
      ],
      plugins: ['external-helpers'],
      babelrc: false,
      exclude: 'node_modules/**',
    })
  ],
}

if (env === 'es' || env === 'cjs') {
  config.output = {...config.output, format: env,}
}
if (env === 'development' || env === 'production') {
  config.output = {...config.output, format: 'umd'}
}

if (env === 'production') {
  config.output.sourcemap = true
  config.plugins.push(
    uglify({}, minify)
  )
}

export default config