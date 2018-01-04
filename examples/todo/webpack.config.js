module.exports = {
  entry: ['babel-polyfill', './index.js'],
  output: {
    filename: "bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.js|\.jsx/,
        exclude: /node_modules/,
        loader: "babel-loader",
      }
    ]
  },
  resolve: {
    alias: {
      ...require('alias-webpack-plugin').default('../alias.config.js'),
    },
  }
};
