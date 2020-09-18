import { has } from 'lodash'
export default ({
  config: {
    server: {
      staticFiles = []
    }
  },
  dependencies: {
    Koa,
    middleware,
    routes,
    loadRoute,
    serveStatic,
    args
  }
}) => () => {
  const app = new Koa()
  middleware.forEach(mw => {
    if (has(mw, 'use') && !mw.use) {
      return
    }

    app.use(mw)
  })
  routes.map(loadRoute).forEach(router => app.use(router.routes(), router.allowedMethods()))
  staticFiles.concat(args.serve).forEach(path => app.use(serveStatic({ path })))
  return app
}
