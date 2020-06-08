import { get, has } from 'lodash'
export default ({
  config: {
    server: {
      port,
      staticFiles = []
    }
  },
  dependencies: {
    logger,
    middleware,
    routes,
    server,
    loadRoute,
    serveStatic,
    args
  }
}) => async () => {
  logger.info('Running http server...')
  middleware.forEach(mw => {
    if (has(mw, 'use') && !mw.use) {
      return
    }

    server.use(mw)
  })
  const staticMW = path => server.use(serveStatic({ path }))
  const routers = routes.map(loadRoute).forEach(router => server.use(router.routes(), router.allowedMethods()))
  staticFiles.concat(args.serve).forEach(path => server.use(serveStatic({ path })))
  await server.listen(port)
  logger.info(`Server started on ${port}`)
}
