const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

process.env.WEBPACK_MODE = process.env.WEBPACK_MODE || 'production';

const setupAppRoutes = process.env.WEBPACK_MODE === 'production' ? require('./middlewares/production') : require('./middlewares/development');

const app = express();

app.use(bodyParser.json());

let server;

async function start(port = 8080) {
  // application routes
  setupAppRoutes(app);
  return new Promise((resolve) => {
    server = http.createServer(app).listen(port, () => {
      console.log(`HTTP server is now running on http://localhost:${port}`);
      resolve();
    })
      .on('error', (err) => {
        console.log(`Failed to start server ${err}`);
      });
  });
}

function close() {
  if (server) {
    server.close();
  }
}

module.exports = {
  close,
  start,
};
