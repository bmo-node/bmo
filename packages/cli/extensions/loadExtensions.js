import path from 'path'
import execa from 'execa'
import es6Require from '@b-mo/es6-require'
import { transform, flattenDeep } from 'lodash'
import fs from 'fs-extra'
import globby from 'globby'
const extensionPrefixes = [
  /bmo-extension/gim,
  /@b-mo\/extension/gim
]
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

const loadExt = async () => {
  const isYarn = await fs.exists('yarn.lock')
  const loaders = [ getNPMGlobalModules(), getLocalModules() ]
  if (isYarn) {
    loaders.push(getYarnGlobalModules())
    loaders.push(getYarnLinkedModules())
  }

  /* eslint-disable require-atomic-updates */
  const modules = flattenDeep((await Promise.all(loaders)))
  return transform(modules, (accumulator, value) => {
    if (extensionPrefixes.some(prefix => prefix.test(value))) {
      console.log(`Loading module ${value}`)
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
}

let CACHED_EXTENSIONS
export default async () => {
  if (!CACHED_EXTENSIONS) {
    try {
      CACHED_EXTENSIONS = await loadExt()
    } catch (error) {
      console.log('There was an error getting your dependencies')
      console.error(error)
      throw error
    }
  }

  return CACHED_EXTENSIONS
}
