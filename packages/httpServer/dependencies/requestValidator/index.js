import { isFunction } from 'lodash'
export default () => schema => {
  if (!isFunction(schema.validate)) {
    throw new Error('Schema must have a validate function')
  }

  return async (ctx, next) => {
    const result = schema.validate(ctx.request.body)
    if (result.error) {
      throw new Error(`Invalid request: ${result.error.annotate()}`)
    }
    await next()
  }
}
