import es6Require from '@b-mo/es6-require'
import loadDependency from './loadDependency'
import compose from './compose'
import context from './context'
const DEPENDENCY_PROPERTY = 'dependencies'
const bmo = {
  di: {
    context: () => context
  },
  es6Require: () => es6Require
}
export default async (config, dependencies) => {
  dependencies.bmo = bmo
  try {
    const formedManifest = await compose(
      Object.keys(dependencies)
        .map(key => async manifest => loadDependency(manifest, key, dependencies[key], dependencies, {}, DEPENDENCY_PROPERTY))
    )({
      config,
      [DEPENDENCY_PROPERTY]: {}
    })
    return formedManifest
  } catch (e) {
    if (e instanceof RangeError) {
      throw new Error('Max Call stack exceeded, you probably have a circular dependency in your manifest')
    }

    throw e
  }
}
