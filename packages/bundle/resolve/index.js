import { mergeWith, isString } from 'lodash'
import es6Require from '@b-mo/es6-require'

const resolveLocalRequire = ({ moduleId, cwd }) => require.resolve(moduleId, {
  paths: [ `${cwd}/node_modules/`, cwd ]
})

const mergeArray = (objValue, srcValue) => {
  console.log(objValue, srcValue)
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return [ ...srcValue, ...objValue ]
  }
}

const resolveBundle = ({ bundle, cwd }) => {
  let resolved = {}
  if (bundle.extends) {
    if (isString(bundle.extends)) {
      resolved = resolveBundle({
        bundle: es6Require(resolveLocalRequire({
          moduleId: bundle.extends,
          cwd
        })),
        cwd
      })
    } else if (Array.isArray(bundle.extends)) {
      resolved = resolveBundle({
        cwd,
        bundle: bundle.extends
          .reverse()
          .reduce((prev, value) => {
            const b = resolveBundle({
              bundle: value,
              cwd
            })
            b.extends = prev
            return b
          }, {})
      })
    } else {
      resolved = resolveBundle({
        bundle: bundle.extends,
        cwd
      })
    }
  }

  bundle = mergeWith({}, bundle, resolved, mergeArray)

  delete bundle.extends
  return bundle
}

export default resolveBundle
