import { has, get } from 'lodash'
const REQUEST_BODY_SCHEMA = 'schema.requestBody'

export default (route, requestValidator, Router) => {
  const apiRouter = new Router()
  if (has(route, REQUEST_BODY_SCHEMA)) {
    const schema = get(route, REQUEST_BODY_SCHEMA)
    apiRouter.use(requestValidator(schema))
  }

  if (Array.isArray(route.handler)) {
    const handler = route.handler.slice(-1)[0]
    const middleware = route.handler.slice(0, route.handler.length - 1)
    middleware.forEach(mw => {
      apiRouter.use(route.path, mw)
    })
    apiRouter[route.method.toLowerCase()](route.path, handler)
  } else {
    apiRouter[route.method.toLowerCase()](route.path, route.handler)
  }

  return apiRouter
}
