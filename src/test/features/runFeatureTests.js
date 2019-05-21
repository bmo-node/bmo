/* eslint-disable import/no-extraneous-dependencies, no-console */

const { spawn } = require('child_process');
const selenium = require('selenium-standalone');
const portfinder = require('portfinder');
const rimraf = require('rimraf');
const process = require('process');
const os = require('os');
const dns = require('dns');

let server;

const skipBuild = process.argv.includes('skipBuild') || process.env.BUILD_NUMBER;
const runInSauce = process.env.BUILD_NUMBER || process.argv.includes('sauce');

function handleFailure(message) {
  console.error(message);
  process.exit(1);
}

function removeOldDist() {
  if (skipBuild) {
    return Promise.resolve();
  }
  console.log('Removing build/build-server directories...');

  return new Promise((resolve) => {
    rimraf('build', () => {
      rimraf('build-server', () => {
        resolve();
      });
    });
  });
}

function executeBuild() {
  if (skipBuild) {
    console.log('skipping build...');
    return Promise.resolve();
  }

  console.log('Running a Build...');
  return new Promise((resolve, reject) => {
    spawn('npm', ['run', 'build:local'], { env: process.env, shell: true, stdio: 'inherit' }).on('close', (code) => {
      if (code) {
        console.error('build failed');
        reject(code);
        process.exit(code);
      } else {
        resolve();
      }
    });
  });
}

function findPort() {
  console.log('Finding a Port to run on...');
  return new Promise((resolve, reject) => {
    portfinder.getPort((portFinderErr, port) => {
      if (portFinderErr) {
        reject(new Error(`Unable to find available port: ${portFinderErr.message}`));
      }

      console.log(`PORT Found: ${port}`);
      resolve(port);
    });
  });
}

function startApp(port) {
  // Need to include server after the build runs.
  /* eslint-disable-next-line global-require */
  server = require('../../../build/server/server');

  console.log('Starting the App...');
  return new Promise((resolve, reject) => {
    server.start(port).then(() => {
      resolve(port);
    }, (error) => {
      reject(new Error(`Failed to start app server: ${error}`));
    });
  });
}

function startSelenium(port) {
  return new Promise((resolve, reject) => {
    if (!runInSauce) { // If targeting local selenium instance
      console.log('Starting Selenium...');
      selenium.start({ javaArgs: '-Dselenium.LOGGER.level=WARNING', spawnOptions: { stdio: 'inherit' } }, (seleniumErr, seleniumServer) => {
        if (seleniumErr) {
          console.error(seleniumErr);
          server.close();
          reject(new Error(`Failed to start selenium: ${seleniumErr.message}`));
        } else {
          resolve({ port, seleniumServer });
        }
      });
    } else {
      resolve({ port });
    }
  });
}

function getFQDN() {
  const uqdn = os.hostname();
  console.log(`uqdn: ${uqdn}`);
  return new Promise((resolve, reject) => {
    dns.lookup(uqdn, { hints: dns.ADDRCONFIG }, (err, ip) => {
      dns.lookupService(ip, 0, (err, hostname) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(hostname);
      });
    });
  });
}

function executeFeatureTests({ port, seleniumServer }) {
  console.log('Executing the Feature Tests...');
  getFQDN().then((fqdn) => {
    const host = runInSauce ? fqdn : 'localhost';
    const wdioConfig = runInSauce ? 'ci' : 'local';

    const argsString = `config/wdio.${wdioConfig}.conf.js --baseUrl http://${host}:${port}`;
    console.log(`Arguments for wdio child process: ${argsString}`);
    const args = argsString.split(' ');
    spawn('wdio', args, { env: process.env, shell: true, stdio: 'inherit' }).on('close', (code) => {
      server.close();
      if (seleniumServer) {
        seleniumServer.kill();
      }
      console.log(`Exiting with code: ${code}`);
      process.exit(code);
    });
  });
}

removeOldDist()
  .then(executeBuild)
  .then(findPort)
  .then(startApp)
  .then(startSelenium)
  .then(executeFeatureTests)
  .catch(handleFailure);

/* eslint-enable import/no-extraneous-dependencies, no-console */
