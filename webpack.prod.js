const path = require('path')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')
const TerserPlugin = require('terser-webpack-plugin')

const { NODE_ENV = 'production' } = process.env

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
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
        test: /\.(ts|js|cjs)$/,
        loader: 'ts-loader',
        options: {},
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.cjs']
  }
}
