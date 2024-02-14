const path = require('path')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')

const { NODE_ENV = 'development' } = process.env

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  watch: NODE_ENV === 'development',
  plugins: [
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['npm run clean:dev'],
        blocking: true,
        parallel: false
      },
      onBuildEnd: {
        scripts: ['npm run run:dev'],
        blocking: false,
        parallel: true
      }
    })
  ],
  output: {
    path: path.resolve(__dirname, 'build-dev'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
