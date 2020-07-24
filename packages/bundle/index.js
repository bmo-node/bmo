import path from 'path'
import pkgup from 'pkg-up'
import { load as loadConfig } from '@b-mo/config'
import loadBundle from './load'
import buildBundle from './build'
import resolve from './resolve'

class Bundle {
  get manifest() {
    return this._manifest
  }

  dependencies(dependencies) {
    if (!this.bundle) {
      this.bundle = { dependencies }
    } else {
      this.bundle.dependencies = dependencies
    }

    return this
  }

  config(config) {
    if (!this.bundle) {
      this.bundle = { config }
    } else {
      this.bundle.config = config
    }

    return this
  }

  async load(params = { dir: process.cwd() }) {
    if (!this.bundle) {
      const { dir } = params
      const pkg = require(await pkgup({ cwd: dir }))
      const config = await loadConfig(path.resolve(dir, './config'))
      this.cwd = dir
      this.bundle = await loadBundle({ dir, pkg, config })
    } else {
      throw new Error('Calling load on a bundle that has already been set is not supported')
    }

    return this
  }

  async build() {
    if (!this.resolved) {
      await this.resolve()
    }

    if (!this._manifest) {
      this._manifest = await buildBundle({ bundle: this.resolved })
    }

    return this
  }

  async resolve() {
    if (!this.bundle) {
      await this.load()
    }

    this.resolved = resolve(this)
  }

  async run(...runArgs) {
    if (!this.manifest) {
      await this.build()
    }

    if (!this.manifest.dependencies.run) {
      throw new Error('No run dependency found. Please add one to your bundle!')
    }

    return this.manifest.dependencies.run(...runArgs)
  }
}

export default () => new Bundle()

