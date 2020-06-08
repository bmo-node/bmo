import es6Require from '@b-mo/es6-require'
import merge from 'lodash.merge'
import path from 'path'
import pkgup from 'pkg-up'
import { load as loadConfig } from '@b-mo/config'
import resolveBundle from './resolve'
import loadBundle from './load'
import buildBundle from './build'

class Bundle {
  constructor(params) {
    this._params = params
  }

  get manifest() {
    return this._manifest
  }

  async load(params) {
    const { dir } = params || this._params || { dir: process.cwd() }
    this.cwd = dir
    const pkg = this.pkg = require(await pkgup({ cwd: dir }))
    this.bundle = await loadBundle({ dir, pkg })
    this.config = await loadConfig(path.resolve(dir, './config'))
    this._loaded = true
    return this
  }

  async build() {
    this._manifest = await buildBundle(this)
    return this
  }

  async run(...runArgs) {
    if (!this.manifest) {
      if (!this._loaded) {
        await this.load()
      }

      await this.build()
    }

    if (!this.manifest.dependencies.run) {
      throw new Error('No run dependency found. Please add one to your bundle!')
    }

    return this.manifest.dependencies.run(...runArgs)
  }
}

export default params => new Bundle(params)

