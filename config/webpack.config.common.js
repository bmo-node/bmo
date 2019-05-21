const { resolve, join } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const IS_DEV = process.env.WEBPACK_MODE !== 'production';

module.exports = {
  target: 'web',
  entry: ['@babel/polyfill', './src/client/index.js'],
  output: {
    publicPath: '/',
    path: resolve(__dirname, '..', 'build', 'client'),
    filename: IS_DEV ? '[name]-[hash].js' : '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      { test: /\.jsx?$/, exclude: /node_modules/, use: ['babel-loader'] },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: { sourceMap: IS_DEV },
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                localIdentName: IS_DEV ? '[path]-[name]_[local]' : '[name]_[local]_[hash:5]', // [hash:base64]
                sourceMap: IS_DEV,
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: IS_DEV },
            },
          ],
        }),
      },
      {
        test: /\.(eot|png|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name]-[chunkhash].css',
      disable: IS_DEV,
    }),
  ],
  resolve: {
    modules: ['node_modules', join('src', 'client')],
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  stats: {
    assetsSort: '!size',
    children: false,
    chunks: false,
    colors: true,
    entrypoints: false,
    modules: false,
  },
};
