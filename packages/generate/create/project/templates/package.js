const base = ({ name, description, serverVersion, cliVersion }) => ({
  name,
  version: '1.0.0',
  description,
  main: 'index.js',
  scripts: {
    start: 'bmo start',
    'start:dev': 'bmo start -d',
    lint: 'eslint .',
    'lint:fix': 'eslint --fix .'
  },
  author: '',
  license: 'SEE LICENSE.md',
  dependencies: {
    '@b-mo/cli': `^${cliVersion}`,
    '@b-mo/http-server': `${serverVersion}`,
    'http-methods-enum': '^0.1.1',
    'http-status-codes': '^1.3.2',
    joi: '^14.3.1',
    lodash: '^4.17.15',
    uuid: '^3.3.2'
  }
})

export default info => JSON.stringify(base(info), 0, 2)
