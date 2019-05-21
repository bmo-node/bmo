exports.config = {


  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: [
    'src/test/features/example.feature',
  ],


  //
  //
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // e.g. using promises you can set the sync option to false.
  sync: true,
  //
  // Level of logging verbosity: Default: silent Options: verbose | silent | command | data | result
  logLevel: 'verbose',
  //
  // Enables colors for log output.
  coloredLogs: true,

  waitforTimeout: 150000,
  connectionRetryTimeout: 240000,
  connectionRetryCount: 3,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: 'shots',
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //

  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework
  // installed before running any tests.
  framework: 'cucumber',

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
    source: true, // <boolean> hide source uris
    profile: [], // <string[]> (name) specify the profile to use
    require: [
      './src/test/features/steps/given.js',
      './src/test/features/steps/then.js',
      './src/test/features/steps/when.js',
    ], // <string[]> (file/dir) require files before executing features
    strict: false, // <boolean> fail if there are any undefined or pending steps
    tags: [], // <string[]> (expression) only execute the features or scenarios with tags matching the expression
    timeout: (2000), // <number> timeout for step definitions
    ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
  },
};
