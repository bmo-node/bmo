import es6Require from '@lmig/bmo-es6-require';
import { routes } from '../../project/templates/config';
// ToDo add schema / repository creation
const handler = ({
	method,
	path,
	additionalPath,
	name,
	version
}) => (
	`import httpStatus from 'http-status-codes';
import httpMethod from 'http-method-enum';
const method = httpMethod.${method.toUpperCase()}
export default ({
  config:{
    routes:{
      ${name}:{
        ${version}:${name}${version.toUpperCase()}
      }
    }
  },
  dependencies:{
    repositories:{
      ${name}:${name}Repository
    },
    schemas:{
      ${name}:${name}Schema
    },
  }
}) => ({
  path:\`\$\{${name}${version.toUpperCase()}\}\`${additionalPath ? `/${additionalPath}` : ''},
  schema:${name}Schema,
  method,
  handler:async (ctx,next)=>{}
})`);
const test = (name) =>
	`import ${name} from '.'
describe('${name}', () => {
  it('Should have some tests', () => {
    throw new Error('Write some tests for ${name} route.')
  })
})
`;
const index = (handlers) => `
${handlers.map(h => `import ${h} from './${h}';`).join('\r\n')}
export default [
${handlers.join(',\r\n')}
]
`;
// TODO make this base dir aware
const routesConfig = (newRoutes) => {
	const routesConfig = es6Require(`${process.cwd()}/config/routes`);
	const merged = { ...routesConfig, ...newRoutes };
	return routes(merged);
};
export default {
	handler,
	test,
	index,
	routesConfig
};
