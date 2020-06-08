
export default ({
  config: {
    pino: pinoOpts
  },
  dependencies: {
    serializers,
    pinoHttp
  }
}) => {
  const wrap = pinoHttp({
    ...pinoOpts,
    serializers
  })
  const pino = async (ctx, next) => {
    wrap(ctx.req, ctx.res)
    ctx.log = ctx.req.log
    ctx.request.log = ctx.req.log
    ctx.response.log = ctx.req.log

    try {
      await next()
    } catch (e) {
      ctx.log.error({
        res: ctx.res,
        err: {
          type: e.constructor.name,
          message: e.message,
          stack: e.stack
        },
        responseTime: ctx.res.responseTime
      }, 'request errored')
      throw e
    }
  }

  pino.logger = wrap.logger
  return pino
}
