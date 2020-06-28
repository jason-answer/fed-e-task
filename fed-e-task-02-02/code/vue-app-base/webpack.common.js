const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[contenthash]',
              outputPath: 'assets',
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'vue app base',
      template: './src/index.html',
      templateParameters: {
        BASE_URL: '/',
      },
    }),
    new VueLoaderPlugin(),
    new StyleLintPlugin({
      files: ['**/*.{css,less,vue}'],
    }),
  ],
}
