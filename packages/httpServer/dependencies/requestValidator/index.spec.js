import joi from 'joi'
import validator from '.'

const schema = joi
  .object()
  .keys({
    name: joi.string().alphanum().required()
  })

describe('Request validator', () => {
  it('Should error when the request body does not match the schema', async () => {
    const testValidator = validator()(schema)
    const ctx = { request: { body: { notName: 'test' }}}
    let error
    try {
      await testValidator(ctx, () => {})
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(Error)
  })
  it('Should error when the schema cannot be validated', async () => {
    try {
      await validator()({})
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
  it('Should call next when the body is valid', async () => {
    const testValidator = validator()(schema)
    const next = jest.fn()
    await testValidator({ request: { body: { name: 'test' }}}, next)
    expect(next).toHaveBeenCalled()
  })
})
