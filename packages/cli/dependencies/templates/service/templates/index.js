import * as config from './config'
import * as dependencies from './dependencies'
import pkg from './package'
import * as routes from './routes'
const yarn = ({ registry }) => `registry "${registry}"`
const npm = ({ registry }) => `registry="${registry}"`

const eslint = () => `
module.exports = {
    "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
    },
    "env": {
        "es6": true,
        "node": true
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
  eslint,
  gitIgnore,
  rc: {
    yarn,
    npm
  }
}
