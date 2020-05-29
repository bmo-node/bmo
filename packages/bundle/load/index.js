import path from 'path'
import fs from 'fs-extra'
import { has } from 'lodash'

export default async ({ pkg, dir }) => {
  const mainFile = path.resolve(dir, (pkg.main || './index.js'))
  let dependencies;
  let appBundle
  if (fs.existsSync(mainFile)) {
    appBundle = await import(mainFile)
    appBundle = appBundle.default || appBundle
    if(!appBundle.dependencies){
      throw new Error('Your main file must export an object with a dependencies key.')
    }
  }
  else {
    const dependenciesPath = path.resolve(dir, './dependencies/index.js')
    if (!fs.existsSync(dependenciesPath)) {
      throw new Error('Module must either have a main file, index.js file or a dependencies/index.js file')
    }
    dependencies = await import(dependenciesPath)
    dependencies = dependencies.default || dependencies
  }
  appBundle = appBundle || { dependencies }
  if(has(pkg, 'bmo.extends')){
    appBundle.extends = pkg.bmo.extends
  }
  return appBundle

}
