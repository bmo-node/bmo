const { exec } = require('child_process');
const fs = require('fs');

/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  if (!fs.existsSync('./node_modules/selenium-standalone/.selenium')) {
    exec('selenium-standalone install', (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
  } else {
    console.log('Skipping "selenium-standalone install" already installed.');
  }
} else {
  console.log('Skipping "selenium-standalone install" in production environment.');
}
/* eslint-enable no-console */
