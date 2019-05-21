const { resolve } = require('path');
const express = require('express');
const compression = require('compression');

const clientBuildPath = resolve(__dirname, '..', '..', 'client');

module.exports = function setup(app) {
  app.use(compression());
  app.use('/', express.static(clientBuildPath));
  app.use('/health', (req, res) => res.json({ description: 'Basic React Application with ES2015, Express.js, and Webpack 4', status: 'UP' }));

  // all other requests be handled by UI itself
  app.get('*', (req, res) => res.sendFile(resolve(clientBuildPath, 'index.html')));
};
