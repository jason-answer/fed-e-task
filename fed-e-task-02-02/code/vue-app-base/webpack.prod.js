const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./webpack.common')

module.exports = merge(config, {
  mode: 'production',
  output: {
    filename: '[name]-[contenthash:8].js',
  },
  devtool: 'nosources-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({ patterns: [{ from: 'public' }] }),
  ],
})
