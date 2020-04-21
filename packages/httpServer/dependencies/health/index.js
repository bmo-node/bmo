export default ({
  dependencies: {
    routes,
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
  const handler = (ctx, next) => {
    ctx.body = {
      status: 'OK',
      healthy: true
    }
    ctx.status = OK
  }

  const error = (ctx, next) => {
    throw new Error('You get an error!')
  }

  routes.push({
    method: GET,
    name: 'Health Check',
    path: '/health',
    handler
  })
  routes.push({
    method: GET,
    name: 'Get Error',
    path: '/error',
    handler: error
  })
}
