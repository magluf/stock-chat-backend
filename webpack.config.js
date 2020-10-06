const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    server: './production/server.js',
  },
  output: {
    path: path.join(__dirname, 'webpacked-production'),
    publicPath: '/',
    filename: '[name].js',
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       exclude: path.resolve(__dirname, 'util'),
  //     },
  //   ],
  // },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
};
