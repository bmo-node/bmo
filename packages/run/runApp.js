// Require the index.js in the baseDirectory
// given an object like:
// {
// extends:{
// config:{},
// dependencies:{}
// },
// dependencies,
// config
// }
// build a manifest merging the extensions,
// and dependencies up the tree
//
// once built run the injector and
// call the run() function exposed
// error if no run() function is defined
import es6Require from '@b-mo/es6-require'
import merge from 'lodash.merge'
import path from 'path'
import pkgup from 'pkg-up'
import fs from 'fs-extra'
import { load as loadConfig } from '@b-mo/config'
import resolveBundle from './resolveBundle'
import loadModules from '@b-mo/module-loader'
import inject from '@b-mo/injector'
const loadAppBundle = ({ main }) => {
  const mainFile = path.resolve(process.cwd(), (main || './index.js'))
  const dependenciesPath = path.resolve(process.cwd(), './dependencies/index.js')
  let appBundle = {}
  if (fs.existsSync(mainFile)) {
    appBundle = es6Require(mainFile)
  } else {
    if (!fs.existsSync(dependenciesPath)) {
      throw new Error('Module must either have a main file, index.js file or a dependencies/index.js file')
    }

    appBundle = es6Require(dependenciesPath)
  }

  return appBundle
}

const run = async () => {
  const pkg = require(await pkgup(process.cwd()))
  console.log(`Starting ${pkg.name}@${pkg.version}`)
  const appBundle = loadAppBundle({ main: pkg.main })
  console.log(appBundle)
  const config = await loadConfig(path.resolve(process.cwd(), './config'))
  config.pkg = pkg
  appBundle.config = config
  const bundle = resolveBundle({
    extends: appBundle,
    dependencies: { ...loadModules(pkg) }
  })
  console.log(bundle)
  const manifest = await inject(bundle.config, bundle.dependencies)
  if (!manifest.dependencies.run) {
    throw new Error('Your bundle must expose a run() function at the root to be compatible with this module')
  }

  manifest.dependencies.run()
}

run()
