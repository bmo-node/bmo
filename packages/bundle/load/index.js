import path from 'path'
import fs from 'fs-extra'
import es6Require from '@b-mo/es6-require'
import { has } from 'lodash'

export default async ({ pkg, dir }) => {
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
      throw new Error('Module must either have a main file, index.js file or a dependencies/index.js file')
    }

    dependencies = es6Require(dependenciesPath)
  }

  appBundle = appBundle || { dependencies }
  if (has(pkg, 'bmo.extends')) {
    appBundle.extends = pkg.bmo.extends
  }

  return appBundle
}
