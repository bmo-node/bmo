import * as config from './config'
import * as dependencies from './dependencies'
import pkg from './package'
import * as routes from './routes'
const yarn = ({ registry }) => `registry "${registry}"`
const npm = ({ registry }) => `registry="${registry}"`
const sonar = ({ name }) =>
  `
sonar.projectKey=com.uscm:${name}
sonar.projectName=${name}

sonar.sources=src
sonar.test=test
sonar.language=js

sonar.exclusions=**/__tests__/**, coverage/**, node_modules/**`

const eslint = () => `
module.exports = {
		"env": {
				"es6": true,
				"node": true
		},
		"extends": "@lmig/eslint-config-cm",
		"globals": {
				"Atomics": "readonly",
				"SharedArrayBuffer": "readonly"
		},
		"parserOptions": {
				"ecmaVersion": 2018,
				"sourceType": "module"
		},
		"rules": {
				'semi':['error','always'],
				'no-tabs': ['error', { allowIndentationTabs: true }],
				'linebreak-style': ['error', 'unix'],
				'import/no-extraneous-dependencies': ['error', {
					devDependencies: true,
				}],
		}
};
`

const gitIgnore = () => `
.DS_Store
node_modules
/dist
/coverage

# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`

export default {
  config,
  dependencies,
  pkg,
  routes,
  sonar,
  eslint,
  gitIgnore,
  rc: {
    yarn,
    npm
  }
}
