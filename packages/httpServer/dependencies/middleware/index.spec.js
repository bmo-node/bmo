import middleware from '.'
import { isFunction } from 'lodash'
describe('middleware', () => {
  it('Should be an array', () => {
    expect(Array.isArray(middleware)).toBeTruthy()
  })
  it('Should be populated with all functions', async () => {
    expect(middleware.every(mw => isFunction(mw))).toBeTruthy()
  })
})
