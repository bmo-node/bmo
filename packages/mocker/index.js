import dotenv from 'dotenv'
import bundle from '@b-mo/bundle'
import { get, set, isArray, isObject, isFunction } from 'lodash'
dotenv.config()
const getMockPaths = (path, mocks, paths = []) => {
  if (isFunction(mocks)) {
    console.log(mocks)
    paths.push(path)
  } else if (isArray(mocks)) {
    mocks.forEach((val, index) => getMockPaths(`${path}[${index}]`, val, mocks, paths))
  } else if (isObject(mocks)) {
    Object.keys(mocks).forEach(key => getMockPaths(`${path.length > 0 ? `${path}.` : ''}${key}`, mocks[key], paths))
  }

  return paths
}

export default ({ config, dependencies }) => {
  let bundleConfig = { ...config }
  let bundleDependencies = { ...dependencies }
  return {
    setRoot(root) {
      this._root = root
      return this
    },
    extend() {
      throw new Error('mocker.extends is deprecated. Please declare extensions as a part of your application definition')
    },
    config(path, value) {
      set(bundleConfig, path, value)
      return this
    },
    mock(path, mock) {
      set(bundleDependencies, path, mock)
      return this
    },
    async build(module) {
      try {
        const mockBundle = bundle()
        if (this._root) {
          mockBundle.setRoot(this._root)
        }

        await mockBundle.load()
        mockBundle.override({
          config: bundleConfig
        })
        mockBundle.add('module', module)
        // Add parallel mocks namespace
        mockBundle.add('mocks', bundleDependencies)
        await mockBundle.build()
        const { mocks, ...dependencies } = mockBundle.manifest.dependencies
        // Now merge the mocks back to the real dependencies.
        getMockPaths('', mocks, [])
          .forEach(path => {
            set(dependencies, path, get(mocks, path))
          })
        const mod = dependencies.module
        mod.manifest = mockBundle.manifest
        return mod
      } catch (e) {
        console.log('Failed to build')
        console.error(e)
        throw e
      }
    }
  }
}

