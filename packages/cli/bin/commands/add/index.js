#!/usr/bin/env node
import commander from 'commander'
import fs from 'fs-extra'
import path from 'path'
import { camelCase, set } from 'lodash'
import logger from '../../../logger'
import packageman from '../../../packageman'

const versionRegex = /@[\^~><=]*\d(.\d)?(.\d)?/
let installTarget
commander
  .arguments('<pkg>', 'Adds an npm module to the bmo dependencies. The package is installed if it does not exist already')
  .option('as <alias>', 'Adds the package with an alias')
  .action(pkg => {
    installTarget = pkg
  })

commander.parse(process.argv)

const run = async () => {
  const pkgPath = path.resolve(process.cwd(), './package.json')
  let pkg = require(pkgPath)
  const version = installTarget.match(versionRegex) || ''
  const pkgName = installTarget.replace(version, '')
  logger.info(`Installing ${pkgName} ${version} to ${pkg.name}`)
  console.log(pkg.dependencies)
  if (!pkg.dependencies[pkgName]) {
    await packageman.add(installTarget)
    // Refresh the package.json in case it was modified.
    delete require.cache[require.resolve(pkgPath)]
    pkg = require(pkgPath)
  }

  pkg.bmo = pkg.bmo || { modules: {}}
  const parts = pkgName.replace('@', '').split('/').map(camelCase)
  let moduleName = parts.length > 1 ? parts[1] : parts[0]
  if (commander.as) {
    moduleName = commander.as
  }

  logger.info(`Adding ${pkgName} as ${moduleName}`)

  set(pkg.bmo, `modules.${pkgName}`, moduleName)
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, 0, 2))
  logger.info(`Added ${pkgName} as ${moduleName}`)
}

run()
