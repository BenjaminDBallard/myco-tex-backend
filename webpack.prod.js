const path = require('path')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')
const TerserPlugin = require('terser-webpack-plugin')

const { NODE_ENV = 'production' } = process.env
console.log(process.env.DATABASE)

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  watch: NODE_ENV === 'development',
  plugins: [
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['npm run clean:prod'],
        blocking: true,
        parallel: false
      }
    })
  ],
  output: {
    path: path.resolve(__dirname, 'build-prod'),
    filename: 'index.js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        loader: 'ts-loader',
        options: {},
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
