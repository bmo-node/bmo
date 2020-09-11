import es6Require from '@b-mo/es6-require'
import { routes } from '../../service/templates/config'

/* eslint-disable no-useless-escape */
const handler = ({
  method,
  additionalPath,
  name,
  version
}) => (
  `export default ({
  config:{
    routes:{
      ${name}:{
        ${version}:${name}${version.toUpperCase()}
      }
    }
  },
  dependencies:{
    http:{
      methods:{
        ${method.toUpperCase()}:method
      }
    }
  }
}) => ({
  path:\`\$\{${name}${version.toUpperCase()}\}\`${additionalPath ? `/${additionalPath}` : ''},
  method,
  handler:async (ctx,next)=>{}
})`)
const test = ({ name }) =>
  `import ${name} from '.'
describe('${name}', () => {
  it('Should have some tests', () => {
    throw new Error('Write some tests for ${name} route.')
  })
})
`
const index = handlers => `
${handlers.map(h => `import ${h} from './${h}';`).join('\r\n')}
export default [
${handlers.join(',\r\n')}
]
`
const routesConfig = newRoutes => {
  const routesConfig = es6Require(`${process.cwd()}/config/routes`)
  const merged = { ...routesConfig, ...newRoutes }
  return routes(merged)
}

export default {
  handler,
  test,
  index,
  routesConfig
}
