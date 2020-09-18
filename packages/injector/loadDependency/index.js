import {
  map,
  set,
  get,
  has,
  isFunction,
  isObject
} from 'lodash'
import extractDependencies from './extractDependencies'
import compose from '../compose'
import circularDependencyCheck from './circularDependencyCheck'
import builtIns from 'builtin-modules'
import es6Require from '@b-mo/es6-require'
const isPackageDependency = ({ dependency, pkg = {}}) => {
  return has(pkg, `dependencies.${dependency}`)
}

const loadDependency = async (manifest, name, dependency, dependencies, circleChecked, dependencyProperty) => {
  const dependencyPath = `${dependencyProperty}.${name}`
  if (has(manifest, dependencyPath)) {
    return manifest
  }

  if (builtIns.indexOf(name) !== -1) {
    set(manifest, `${dependencyProperty}.${name}`, es6Require(name))
    return manifest
  }

  if (isPackageDependency({ pkg: get(manifest, 'config.pkg'), dependency: name })) {
    set(manifest, `${dependencyProperty}.${name}`, es6Require(name))
    return manifest
  }

  if (isFunction(dependency)) {
    if (!circleChecked[name]) {
      circularDependencyCheck(name, dependencies, dependencyProperty)
      circleChecked[name] = true
    }

    const deps = extractDependencies(dependency, dependencyProperty)
    await compose(deps.map(dep => async manifest => {
      if (!get(manifest, dependencyPath) && dep !== name) {
        if (!get(dependencies, dep) && !get(manifest, dep)) {
          const parts = dep.split('.')
          if (parts.length > 1) {
            // Covers the case for deeply nested modules.
            const moduleToLoad = parts[0]
            manifest = await (loadDependency(manifest, moduleToLoad, dependencies[moduleToLoad], dependencies, circleChecked, dependencyProperty))
          } else if (builtIns.indexOf(dep) === -1 &&
            !isPackageDependency({
              pkg: get(manifest, 'config.pkg'),
              dependency: dep
            })) {
            throw new Error(`Unknown dependency ${dep} in module: ${name}`)
          }
        }

        manifest = await loadDependency(manifest, dep, get(dependencies, dep), dependencies, circleChecked, dependencyProperty)
      }

      return manifest
    }))(manifest)

    if (!has(manifest, dependencyPath)) {
      const value = await dependency(manifest)
      set(manifest, `${dependencyProperty}.${name}`, value)
    }
  } else if (isObject(dependency) && !Array.isArray(dependency)) {
    await compose(
      map(dependency, (dep, subName) => async manifest => loadDependency(manifest, `${name}.${subName}`, dep, dependencies, circleChecked, dependencyProperty))
    )(manifest)
  } else if (Array.isArray(dependency)) {
    await compose(
      map(dependency, (dep, index) => async manifest => loadDependency(manifest, `${name}[${index}]`, dep, dependencies, circleChecked, dependencyProperty))
    )(manifest)
  } else {
    const parts = name.split('.')
    if (parts.length > 1) {
      // Covers the case for deeply nested modules.
      const moduleToLoad = parts[0]
      manifest = await (loadDependency(manifest, moduleToLoad, dependencies[moduleToLoad], dependencies, circleChecked, dependencyProperty))
    } else {
      throw new Error(`Dependency ${name} must be either a function, object, or array. type ${typeof dependency} not injectable`)
    }
  }

  return manifest
}

export default loadDependency
