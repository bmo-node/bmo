import { parse as parseAst } from 'espree'
import { parse as parseQuery, match } from 'esquery'
import { get, flattenDeep } from 'lodash'

const functionRegex = /(function)(\s?\([\s\S]+)/
const FN_NAME = 'anon'

export default (fn, dependencyProperty) => {
  const fnString = wrapAnon(fn.toString())
  const ast = parseAst(fnString, { ecmaVersion: 11 })
  const root = ast.body[0]
  if (root && paramParsers[root.type]) {
    const params = paramParsers[root.type](root, dependencyProperty)
    return params
  }

  throw new Error(`No parser for ${root.type}`)
}

const wrapAnon = fnString => {
  if (fnString.match(functionRegex)) {
    return fnString.replace(functionRegex, `$1 ${FN_NAME}$2`)
  }

  return fnString
}

const paramParsers = {
  ExpressionStatement: (root, dependencyProperty) => {
    const configParam = root.expression.params[0]
    if (configParam && configParsers[configParam.type]) {
      return configParsers[configParam.type](root, configParam, dependencyProperty)
    }

    return []
  },
  FunctionDeclaration: (root, dependencyProperty) => {
    const configParam = root.params[0]
    if (configParam && configParsers[configParam.type]) {
      return configParsers[configParam.type](root, configParam, dependencyProperty)
    }

    return []
  }
}

const configParsers = {
  Identifier: (root, configNode, dependencyProperty) => {
    // Find any references to config.dependencies.thing AST
    // from the root down
    const query = parseQuery('[type="MemberExpression"]')
    const expressions = match(root, query)
    return expressions
      .filter(n => get(n, 'object.object.name') === configNode.name && get(n, 'object.property.name') === dependencyProperty)
      .map(n => get(n, 'property.name'))
  },
  ObjectPattern: (root, configNode, dependencyProperty) => {
    // Find references to destructured ASTs from the root down.
    let deps = []
    const dependencyNode = configNode.properties.find(n => n.key.name === dependencyProperty)
    if (dependencyNode) {
      deps = flattenDeep(get(dependencyNode, 'value.properties', [])
        .map(n => getDependencies(n, '')))
    }

    return deps
  }
}

const getDependencies = (root, path) => {
  const currentKeyName = root.key.type === 'Literal' ? root.key.value : root.key.name
  path = path.length === 0 ? currentKeyName : `${path}.${currentKeyName}`
  if (root.value.type === 'ObjectPattern') {
    return root.value.properties.map(p => getDependencies(p, path))
  }

  return path
}
