const path = require('path');

const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const commonConfig = {
  entry: {
    ...defaultConfig.entry(),
    styleguide: path.resolve(__dirname, './src/js/styleguide.js'),
  },

  output: {
    ...defaultConfig.output,
  },

  resolve: {
    ...defaultConfig.resolve,
    alias: {
      '@components': path.resolve(__dirname, './src/js/app/components'),
      '@core': path.resolve(__dirname, './src/js/app/core'),
      '@services': path.resolve(__dirname, './src/js/app/services'),
      '@utils': path.resolve(__dirname, './src/js/app/utils'),
    },
  },

  plugins: [...defaultConfig.plugins],

  module: {
    ...defaultConfig.module,
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = commonConfig;
