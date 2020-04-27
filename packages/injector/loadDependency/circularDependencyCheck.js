import { get, isFunction, isObject } from 'lodash'
import extractDependencies from './extractDependencies'

export default (rootModuleName, dependencies, dependencyProperty) => {
  const checked = {}
  const moduleDeps = extractDependencies(get(dependencies, rootModuleName), dependencyProperty)
  // Now you have all first levelDeps
  while (moduleDeps.length > 0) {
    const mod = moduleDeps.shift()
    if (!checked[mod]) {
      const newMod = get(dependencies, mod)
      if (isFunction(newMod)) {
        const deps = extractDependencies(get(dependencies, mod), dependencyProperty)
        deps.forEach(d => {
          if (d === rootModuleName) {
            throw new Error(`Circular dependency detected in ${rootModuleName} and ${mod}`)
          }

          if (!checked[d]) {
            moduleDeps.push(d)
          }
        })
        checked[mod] = true
      } else if (Array.isArray(newMod)) {
        Object.keys(newMod).forEach(k => {
          moduleDeps.push(`${mod}[${k}]`)
        })
      } else if (isObject(newMod)) {
        Object.keys(newMod).forEach(k => {
          moduleDeps.push(`${mod}.${k}`)
        })
      }
    }
  }
}
