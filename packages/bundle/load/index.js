import path from 'path'
import fs from 'fs-extra'
import es6Require from '@b-mo/es6-require'
import loadModules from '@b-mo/module-loader'
import { has, merge } from 'lodash'

const loadAppBundle = async ({ pkg, dir }) => {
  const mainFile = path.resolve(dir, (pkg.main || './index.js'))
  let dependencies
  let appBundle
  if (fs.existsSync(mainFile)) {
    appBundle = es6Require(mainFile)
    if (!appBundle.dependencies) {
      throw new Error('Your main file must export an object with a dependencies key.')
    }
  } else {
    const dependenciesPath = path.resolve(dir, './dependencies/index.js')
    if (!fs.existsSync(dependenciesPath)) {
      throw new Error(`Module must either have a main file, index.js file or a dependencies/index.js file. No matching paths in ${dir}`)
    }

    dependencies = es6Require(dependenciesPath)
  }

  appBundle = appBundle || { dependencies }
  if (has(pkg, 'bmo.extends')) {
    appBundle.extends = pkg.bmo.extends
  }

  return appBundle
}

export default async ({ pkg, dir, config }) => {
  const bundle = await loadAppBundle({ pkg, dir })
  const mergedBundle = merge({}, {
    dependencies: loadModules(pkg),
    config: { ...config, pkg }
  }, bundle)
  return mergedBundle
}
