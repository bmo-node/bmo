import mocker from '@b-mo/mocker'
import has from 'lodash.has'
// Import jest from 'jest'
console.log(jest)
const wrapWithMockFunctions = maxDepth => (target, dependencyBundle, depth, parentKey, parentInBundle) => {
  if (target === undefined || target === null || depth > maxDepth) {
    return target
  }

  if (typeof target === 'function') {
    return jest.fn(target)
  }

  if (typeof target === 'object') {
    const isArray = Array.isArray(target)
    return Object.keys(target).reduce((accu, key) => {
      const path = isArray ? `${parentKey}[${key}]` : parentKey ? `${parentKey}.${key}` : key
      const inBundle = has(dependencyBundle, path)
      console.log(`${path} in ${inBundle}`)
      accu[key] = wrapWithMockFunctions(target[key], dependencyBundle, parentInBundle ? 0 : depth++, path, inBundle)
      return accu
    }, Array.isArray(target) ? [] : {})
  }

  return target
}

export default ({ postProcess, maxDepth = 1, ...params } = { postProcess: []}) => mocker({
  ...params,
  postProcess: [ (mod, dependencyBundle) => {
    mod.manifest = wrapWithMockFunctions(maxDepth)(mod.manifest.dependencies, dependencyBundle, 0, '', true)
    console.log(mod.manifest)
    return mod
  }, ...postProcess ]
})
