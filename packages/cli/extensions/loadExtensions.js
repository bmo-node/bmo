import execa from 'execa'
import es6Require from '@b-mo/es6-require'
import { transform, flattenDeep } from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import globby from 'globby'

const getTopLevelPackages = async dir => {
  const packages = await globby(`${dir}/*/**/package.json`)
  return packages.filter(pkg => !/node_modules/gi.test(pkg.replace(dir, '')))
}

const exec = async command => execa.command(command, { shell: true })

const globalPath = {
  yarn: 'yarn global dir',
  npm: 'npm config get prefix'
}

const getNPMGlobalModules = async () => {
  const folder = (await exec(globalPath.npm)).stdout
  return getTopLevelPackages(path.resolve(folder, 'lib/node_modules'))
}

const getYarnGlobalModules = async () => {
  const folder = (await exec(globalPath.yarn)).stdout
  return getTopLevelPackages(path.resolve(folder, 'node_modules'))
}

const getYarnLinkedModules = async () => {
  const folder = (await exec(globalPath.yarn)).stdout
  return getTopLevelPackages(path.resolve(folder, '../link'))
}

const getLocalModules = async () => {
  const folder = process.cwd()
  return getTopLevelPackages(path.resolve(folder, './node_modules'))
}

const isLocalModule = path => {
  return path.includes(process.cwd())
}

let CACHED_EXTENSIONS
export default async () => {
  if (CACHED_EXTENSIONS) {
    return CACHED_EXTENSIONS
  }

  try {
    const isYarn = await fs.exists('yarn.lock')
    const loaders = [ getNPMGlobalModules(), getLocalModules() ]
    if (isYarn) {
      loaders.push(getYarnGlobalModules())
      loaders.push(getYarnLinkedModules())
    }

    const modules = flattenDeep((await Promise.all(loaders)))

    CACHED_EXTENSIONS = transform(modules, (accumulator, value, key) => {
      if (value.match(/bmo-extension/gim)) {
        const modulePath = path.dirname(value)
        const pkg = es6Require(value)
        if (accumulator[pkg.name]) {
          if (isLocalModule(modulePath)) {
            console.log(`Loading local module ${pkg.name} over global version`)
            accumulator[pkg.name] = es6Require(modulePath)
          }
        } else {
          accumulator[pkg.name] = es6Require(modulePath)
        }
      }

      return accumulator
    }, {})
    return CACHED_EXTENSIONS
  } catch (e) {
    console.log('There was an error getting your dependencies')
    console.error(e)
  }
}
