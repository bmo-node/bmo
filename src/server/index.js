require('@babel/polyfill');
const fs = require('fs');
const server = require('./server');

process.on('uncaughtException', (err) => {
  fs.writeSync(1, `Caught exception: ${err}\n`);
});

const port = process.env.PORT || 8080;

console.log('Starting the App...');
return new Promise((resolve, reject) => {
  server.start(port).then(() => {
    resolve(port);
  }, (error) => {
    reject(new Error(`Failed to start app server ${error}`));
  });
});
