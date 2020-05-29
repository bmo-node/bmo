import es6Require from '@b-mo/es6-require'
import merge from 'lodash.merge'
import path from 'path'
import pkgup from 'pkg-up'
import { load as loadConfig } from '@b-mo/config'
import resolveBundle from './resolve'
import loadBundle from './load'
import buildBundle from './build'

export default {
  async load({ dir = process.cwd() } = {}) {
    const pkg = require(await pkgup(dir))
    console.log(`Building ${pkg.name}@${pkg.version}`)
    const bundle = await loadBundle({ dir, pkg })
    const config = await loadConfig(path.resolve(dir, './config'))
    const manifest = await buildBundle({ bundle, config, pkg })
    console.log(manifest)
    return {
      manifest,
      run(...runArgs) {
        if (!manifest.dependencies.run) {
          throw new Error('No run dependency found. Please add one to your bundle!')
        }

        return manifest.dependencies.run(...runArgs)
      }
    }
  }
}

