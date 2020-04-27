export default ({
  dependencies: {
    errorMap
  }
}) => async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    ctx.status = errorMap.getErrorStatus(e)
    if (e.message) {
      ctx.body = {
        message: e.message
      }
    }
  }

  return ctx
}
