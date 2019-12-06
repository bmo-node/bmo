export default ({
  dependencies: {
    errorMap
  }
}) => async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.status = errorMap.getErrorStatus(error)
    if (error.message) {
      ctx.body = {
        message: error.message
      }
    }
  }

  return ctx
}
