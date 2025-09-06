const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');

const devConfig = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  // Critical: Set the public path for HMR
  output: {
    ...common.output,
    publicPath: 'http://localhost:8080/',
  },

  devServer: {
    ...common.devServer,
    static: './build',
    hot: true,
    port: 8080,
    host: 'localhost',

    // Allow external connections (important for WordPress)
    allowedHosts: 'all',

    // CORS headers for WordPress
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },

    // Don't open browser automatically
    open: false,

    // Serve files from memory, not disk
    devMiddleware: {
      writeToDisk: false,
    },
  },
});

module.exports = devConfig;
