import joi from 'joi'
import ui from './ui'
import swagger from '.'
import http from '../http'
import createSwaggerDefinition from './createSwaggerDefinition'

const schema = joi
  .object()
  .keys({
    name: joi.string().alphanum().required()
  })
const docsPath = '/api/docs'
const uiPath = '/docs'
const testRoutes = () => ([
  {
    path: '/api/test/v1',
    method: 'get',
    schema: {
      queryParams: schema,
      responseBody: schema
    },
    handler: () => {}
  }, {
    path: '/api/test/v1',
    method: 'post',
    schema: {
      requestBody: schema,
      responseBody: schema
    },
    handler: () => {}
  }, {
    path: '/api/test/v1/:id',
    method: 'put',
    schema: {
      requestBody: schema,
      responseBody: schema
    },
    handler: () => {}
  }, {
    path: '/api/test/v1/:id',
    method: 'get',
    handler: () => {}
  }, {
    path: '/api/test/v1/:id',
    method: 'delete',
    schema: {
      requestBody: schema
    },
    handler: () => {}
  }
])

const manifest = () => ({
  config: {
    pkg: {
      name: 'test',
      version: '1.0.0',
      author: 'tsteele',
      description: 'test'
    },
    swagger: {
      urls: {
        docs: docsPath,
        ui: uiPath
      }
    }
  },
  dependencies: {
    routes: [ ...testRoutes() ],
    createSwaggerDefinition: createSwaggerDefinition(),
    http: http()
  }
})
describe('swagger', () => {
  it('Should inject a route with the api docs path', () => {
    const m = manifest()
    swagger(m)
    expect(m.dependencies.routes.some(r => r.path === docsPath)).toBeTruthy()
  })
  it('Should inject a route with the docs ui path', () => {
    const m = manifest()
    swagger(m)
    expect(m.dependencies.routes.some(r => r.path === uiPath)).toBeTruthy()
  })

  it('Should send the result from createSwaggerDefinition', async () => {
    const ctx = {}
    const swaggerDef = { swagger: 'true' }
    const m = manifest()
    m.dependencies.createSwaggerDefinition = jest.fn(() => swaggerDef)
    swagger(m)
    const route = m.dependencies.routes.find(r => r.path === docsPath)
    await route.handler(ctx, jest.fn())
    expect(ctx.body).toEqual(swaggerDef)
    jest.resetAllMocks()
  })

  it('Should send the result from ui', async () => {
    const ctx = {}
    const swaggerDef = { swagger: 'true' }
    const m = manifest()
    m.dependencies.createSwaggerDefinition = jest.fn(() => swaggerDef)
    swagger(m)
    const route = m.dependencies.routes.find(r => r.path === uiPath)
    await route.handler(ctx, jest.fn())
    expect(ctx.body).toEqual(ui({ docs: docsPath }))
    jest.resetAllMocks()
  })
})
