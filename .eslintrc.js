// $ cat .eslintrc.js
module.exports = {
  extends: ['airbnb', 'plugin:react/recommended'],
  plugins: ['webdriverio'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    jquery: true,
    jest: true,
    mocha: true,
    'webdriverio/wdio': true,
    node: true,
  },
  rules: {
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'max-len': ['warn', {
      code: 150,
    }],
    'react/jsx-filename-extension': [1, {
      extensions: ['.js', '.jsx'],
    }],
    'react/prefer-stateless-function': 0,
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
    }],
    'no-underscore-dangle': 0,
    'react/no-unescaped-entities': 0,
    'consistent-return': 0,
    'react/prop-types': 0,
    'no-shadow': 0,
    'no-console': 0,
    'jsx-a11y/anchor-is-valid': ['error', {
      component: 'Link',
    }, {
      specialLink: 'to',
    }, {
      aspects: ['noHref', 'invalidHref', 'preferButton'],
    }],
  },
  overrides: [{
    files: ['**/{__tests__,test}/**/*.{js,jsx}'],
    rules: {
      'no-unused-expressions': 0,
    },
  }],
};
