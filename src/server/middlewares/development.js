const { resolve } = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../../config/webpack.config.local');

const compiler = webpack(webpackConfig);

module.exports = function setup(app) {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
    },
  }));

  app.use(webpackHotMiddleware(compiler));

  app.use('/health', (req, res) => res.json({ description: 'Basic React Application with ES2015, Express.js, and Webpack 4', status: 'UP' }));
  // all other requests be handled by UI itself
  app.get('*', (req, res) => res.sendFile(resolve(__dirname, '..', '..', '..', 'build-dev', 'client', 'index.html')));
};
