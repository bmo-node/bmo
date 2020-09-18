import fs from 'fs-extra'
import path from 'path'
import { camelCase, set } from 'lodash'

const versionRegex = /@[\^~><=]*\d(.\d)?(.\d)?/

export default ({ dependencies: { logger, packageman }}) => async ({ installTarget, alias }) => {
  const pkgPath = path.resolve(process.cwd(), './package.json')
  let pkg = require(pkgPath)
  const version = installTarget.match(versionRegex) || ''
  const pkgName = installTarget.replace(version, '')
  logger.info(`Installing ${pkgName} ${version} to ${pkg.name}`)
  if (!pkg.dependencies[pkgName]) {
    await packageman.add(installTarget)
    // Refresh the package.json in case it was modified.
    delete require.cache[require.resolve(pkgPath)]
    pkg = require(pkgPath)
  }

  pkg.bmo = pkg.bmo || { modules: {}}
  const parts = pkgName.replace('@', '').split('/').map(camelCase)
  let moduleName = parts.length > 1 ? parts[1] : parts[0]
  if (alias) {
    moduleName = alias
  }

  logger.info(`Adding ${pkgName} as ${moduleName}`)

  set(pkg.bmo, `modules.${pkgName}`, moduleName)
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, 0, 2))
  logger.info(`Added ${pkgName} as ${moduleName}`)
}
