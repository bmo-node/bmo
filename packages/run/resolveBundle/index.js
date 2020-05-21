import { mergeWith, isString } from 'lodash'
import es6Require from '@b-mo/es6-require'
const resolveLocalRequire = module => require.resolve(module, {
  paths: [ `${process.cwd()}/node_modules/` ]
})
const resolveBundle = bundle => {
  let resolved = {}
  if (bundle.extends) {
    if (isString(bundle.extends)) {
      resolved = resolveBundle(es6Require(resolveLocalRequire(bundle.extends)))
    } else {
      resolved = resolveBundle(bundle.extends)
    }
  }

  bundle = mergeWith({}, bundle, resolved, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue)
    }
  })

  delete bundle.extends
  return bundle
}

export default resolveBundle
