import inject from './inject'
const isObject = o => {
  return (o instanceof Object && !(o instanceof Array))
}

export default () => new Context()

class Context {
  config(config) {
    this._config = config
    return this
  }

  dependencies(dependencies) {
    this._dependencies = dependencies
    return this
  }

  expose(values) {
    let keys
    if (isObject(values)) {
      keys = Object.keys(values)
    } else if (Array.isArray(values)) {
      keys = values
    } else if (!values) {
      this._keys = []
    }

    this._keys = keys
    return this
  }

  inherit(modules) {
    this._inherited = Object.keys(modules).reduce((acc, key) => {
      acc[key] = () => modules[key]
    }, {})
  }

  async build() {
  	console.log('BMO injector: \'build\' will be deprecated in the next minor version of this package. Calling \'module\' will automatically build for you.')
  	await this._build()
  	return this
  }

  async _build() {
    if (!this._manifest) {
      const all = {
        ...this._dependencies,
        ...this._inherited
      }
      this._manifest = await inject(this._config, all)
    }

    return this
  }

  async module() {
    await this._build()
    const keys = (this._keys === undefined) ? [] : Object.keys(this._manifest.dependencies)
    const exposed = {}
    keys.forEach(key => {
      if (!this._manifest.dependencies.hasOwnProperty(key)) {
        throw new Error(`Unknown key ${key}`)
      }

      exposed[key] = this._manifest.dependencies[key]
    })
    return exposed
  }
}
