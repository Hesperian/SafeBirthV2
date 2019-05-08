const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const preProcess = require('./webpack.preprocess');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'www'),
  entry: './js/app.js',
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(process.env.VERSION),
      __PREPROCESS__: JSON.stringify(preProcess.getPageInfo())
    }),
    new HtmlWebpackPlugin({
      title: 'Safe Abortion',
      template: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([
      {
        from: 'img/**/*',
        to: '.'
      },
      {
        from: 'locales/**/*',
        to: '.'
      }
    ], {})
  ],
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['env',
              {'browsers': ['iOS >= 9', 'Android >= 4.4']}
            ]
          ]
        }
      }]
    },
    {
        test: /\.(s*)css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};