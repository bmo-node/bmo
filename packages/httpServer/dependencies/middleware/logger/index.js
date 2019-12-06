import pinoHttp from 'pino-http'
export default ({ config: { pino: pinoOpts }}) => {
  const wrap = pinoHttp(pinoOpts)
  const pino = async (ctx, next) => {
    wrap(ctx.req, ctx.res)
    ctx.log = ctx.request.log = ctx.response.log = ctx.req.log /* eslint-disable-line no-multi-assign */
    try {
      await next()
    } catch (error) {
      ctx.log.error({
        res: ctx.res,
        err: {
          type: error.constructor.name,
          message: error.message,
          stack: error.stack
        },
        responseTime: ctx.res.responseTime
      }, 'request errored')
      throw error
    }
  }

  pino.logger = wrap.logger
  return pino
}
