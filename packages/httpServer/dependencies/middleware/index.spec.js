import { isFunction } from 'lodash'
import middleware from '.'
describe('middleware', () => {
  it('Should be an array', () => {
    expect(Array.isArray(middleware)).toBeTruthy()
  })
  it('Should be populated with all functions', async () => {
    expect(middleware.every(mw => isFunction(mw))).toBeTruthy()
  })
})
