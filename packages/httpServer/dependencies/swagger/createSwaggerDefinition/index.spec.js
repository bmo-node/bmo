import createSwaggerDefinition from '.'
import joi from 'joi'
const serverInfo = {
  title: 'testServer',
  description: 'test server',
  contact: 'no one',
  version: '0.0.1'
}
const testRoutes = [{
  description: 'a  test path to demo things work',
  method: 'GET',
  schema: {
    requestBody: joi.object().keys({
      test: joi.number().description('test date').default(0).allow(1, 2, 3)
    }),
    responseBody: joi.object().keys({
      test: joi.date().default(new Date())
    }),
    queryParams: joi.object().keys({
      testParam: joi.number().allow(1, 2, 3).description('a test').valid(1, 2, 3).default(0).required()
    }),
    pathParams: joi.object().keys({
      idtest: joi.number().allow(1).description('asdf').valid(1, 2, 3)
    })
  },
  path: '/api/test/v1/:idtest',
  handler: ctx => {
    ctx.body = { res: 1 }
  }
},
{
  description: 'demo POST',
  method: 'POST',
  path: '/api/test/v2/:boom',
  handler: ctx => {
    ctx.body = { res: 1 }
  }
}]
describe('createSwaggerDefinition', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('defined routes should match snapshot', async () => {
    const apiDocs = createSwaggerDefinition()(testRoutes, serverInfo)
    expect(apiDocs).toMatchSnapshot()
  })
})
