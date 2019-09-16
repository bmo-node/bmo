
module.exports = {
  extends: ['@lmig/eslint-config-cm'],
  parser: 'babel-eslint',
  env: {
    jest: true,
    node: true,
  },
  rules: {
    'semi':['error','always'],
    'callback-return':['error',['cb']],
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'linebreak-style': ['error', 'unix'],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
    }],
  }
}
