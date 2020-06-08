import { mergeWith, isString } from 'lodash'
import es6Require from '@b-mo/es6-require'

const resolveLocalRequire = ({ moduleId, cwd }) => require.resolve(moduleId, {
  paths: [ `${process.cwd()}/node_modules/`, cwd ]
})

const mergeArray = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
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
