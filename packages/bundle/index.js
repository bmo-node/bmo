import path from 'path'
import pkgup from 'pkg-up'
import { load as loadConfig } from '@b-mo/config'
import loadBundle from './load'
import buildBundle from './build'
import resolve from './resolve'
import { has, set, merge } from 'lodash'

const BUNDLE_DEPENDENCIES = 'bundle.dependencies'
const BUNDLE_CONFIG = 'bundle.config'
class Bundle {
  constructor() {
    this._overrides = {}
  }

  get manifest() {
    return this._manifest
  }

  dependencies(dependencies) {
    if (has(this, BUNDLE_DEPENDENCIES)) {
      throw new Error('Dependencies have already been loaded for this bundle!')
    }

    set(this, BUNDLE_DEPENDENCIES, dependencies)
    return this
  }

  config(config) {
    if (has(this, BUNDLE_CONFIG)) {
      throw new Error('Config already loaded for bundle')
    }

    set(this, BUNDLE_CONFIG, config)
    return this
  }

  setRoot(dir) {
    this._root = dir
    return this
  }

  get root() {
    return this._root || process.cwd()
  }

  async load() {
    if (!this.bundle) {
      const dir = this.root
      const pkg = require(await pkgup({ cwd: dir }))
      const config = await loadConfig(path.resolve(dir, './config'))
      this.cwd = dir
      this.bundle = await loadBundle({ dir, pkg, config })
    } else {
      throw new Error('Calling load on a bundle that has already been created is not supported')
    }

    return this
  }

  async build() {
    if (this._manifest) {
      throw new Error('Cannot call build twice on the same module.')
    }

    if (!this.resolved) {
      await this.resolve()
    }

    this._manifest = await buildBundle({
      bundle: merge({}, this.resolved, this._overrides)
    })
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

  override({ dependencies, config }) {
    this._overrides = merge({}, this._overrides, { dependencies, config })
  }
}

export default () => new Bundle()

