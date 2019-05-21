const process = require('process');
const commonConf = require('./wdio.common.conf').config;

// =====================
// Sauce labs Build numbers
// =====================
let buildName = '';
if (process.env.BUILD_NUMBER) {
  buildName = `ci-functional:dna-fusion-${process.env.BRANCH_NAME.replace('\\', '-').replace('/', '-')}-${process.env.BUILD_NUMBER}`;
} else {
  buildName = `local-functional:dna-fusion-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
}

const config = {

  // =====================
  // Server Configurations
  // =====================
  // Host address of the running Selenium server. This information is usually obsolete as
  // WebdriverIO automatically connects to localhost. Also, if you are using one of the
  // supported cloud services like Sauce Labs, Browserstack, or Testing Bot you don't
  // need to define host and port information because WebdriverIO can figure that out
  // according to your user and key information. However, if you are using a private Selenium
  // backend you should define the host address, port, and path here.
  //

  host: 'saucelabs-nonprod.lmig.com',
  port: 80,
  path: '/wd/hub',
  services: ['sauce'],
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,

  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1, wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10; all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  //
  maxInstances: 25,

  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [{
    platform: 'Windows 7',
    browserName: 'chrome',
    name: 'Chrome on Windows 7',
    'parent-tunnel': 'LMSauceLabs',
    tunnelIdentifier: 'nonprod',
    build: buildName,
  }],

  reporters: [
    'junit', 'spec',
  ],
  reporterOptions: {
    junit: {
      outputDir: './reports/FeatureTests',
    },
  },

  //
  // If you are using Cucumber you need to specify the location of your step definitions.
  // See also: https://github.com/webdriverio/wdio-cucumber-framework#cucumberopts-options
  cucumberOpts: {
    backtrace: true, // <boolean> show full backtrace for errors
    compiler: ['js:@babel/register'], // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    dryRun: false, // <boolean> invoke formatters without executing steps
    failFast: false, // <boolean> abort the run on first failure
    format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    colors: true, // <boolean> disable colors in formatter output
    snippets: true, // <boolean> hide step definition snippets for pending steps
    source: false, // <boolean> hide source uris
    profile: [], // <string[]> (name) specify the profile to use
    require: [
      './src/test/features/steps/given.js',
      './src/test/features/steps/then.js',
      './src/test/features/steps/when.js',
    ], // <string[]> (file/dir) require files before executing features
    strict: true, // <boolean> fail if there are any undefined or pending steps
    tags: [], // <string[]> (expression) only execute the features or scenarios with tags matching the expression
    timeout: (20000), // <number> timeout for step definitions
    ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
  },
};

exports.config = Object.assign(commonConf, config);
