import { transform, each } from 'lodash'
export default () => (extensionPackages, type) =>
  transform(extensionPackages, (accumulator, mod, moduleName) => {
    each(mod[type], (template, name) => {
      template.__moduleName = moduleName
      let key = name
      if (accumulator[key]) {
        key = `${moduleName}.${name}`
        if (accumulator[key]) {
          throw new Error(`Duplicate ${type} key ${name} in namespace ${moduleName}`)
        }

        accumulator[key] = mod
        // Rename the other one
        const other = accumulator[name]
        const otherKey = `${other.__moduleName}.name`
        accumulator[otherKey] = other
        Object.defineProperty(accumulator, name, {
          get: () => {
            throw new Error(`Duplicate ${type} key ${name}, Use ${key} or ${otherKey} instead`)
          }
        })
        console.warn(`Duplicate ${type} found for ${name}. Use ${key} when trying to invoke this ${type}`)
      } else {
        accumulator[key] = template
      }
    })
    return accumulator
  }, {})
