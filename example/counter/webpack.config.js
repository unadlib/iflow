module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js|\.jsx/,
        exclude: /node_modules/,
        use: 'babel-loader',
      }
    ]
  },
  resolve: {
    alias: {
      ...require('alias-webpack-plugin').default('../alias.config.js'),
    },
  }
}