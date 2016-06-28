var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {
  entry: {
    main: './src/index.js'
  },

  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
    filename: "bundle.js",
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.svg$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
    ]
  },

  resolve: {
    modulesDirectories: ['node_modules']
  },

  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ]
};
