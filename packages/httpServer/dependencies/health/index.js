export default ({
  dependencies: {
    routes,
    joi,
    http: {
      status: {
        OK
      },
      methods: {
        GET
      }
    }
  }
}) => {
  const handler = ctx => {
    ctx.body = {
      status: 'OK',
      healthy: true
    }
    ctx.status = OK
  }

  const errorHandler = () => {
    throw new Error('You get an error!')
  }

  const health = joi.object().keys({
    status: joi.string(),
    healthy: joi.boolean()
  })

  const error = joi.object().keys({
    message: joi.string()
  })

  routes.push({
    method: GET,
    name: 'health',
    path: '/health',
    schema: {
      responseBody: health
    },
    handler
  })
  routes.push({
    method: GET,
    name: 'error',
    path: '/error',
    schema: {
      responseBody: error
    },
    handler: errorHandler
  })
}
