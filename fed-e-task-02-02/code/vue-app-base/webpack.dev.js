const path = require('path')
const merge = require('webpack-merge')
const config = require('./webpack.common')

module.exports = merge(config, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 3000,
    hotOnly: true,
    overlay: {
      errors: true,
      warnings: false,
    },
  },
})
