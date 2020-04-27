import ExtendableError from 'extendable-error'
import { each } from 'lodash'
import errors from '../errors'
import http from '../http'
import mapper from '.'
class TestError extends ExtendableError {}
const manifest = () => ({
  dependencies: {
    errors: errors(),
    http: http()
  }
})
const TEST_STATUS = 420

describe('errorMap', () => {
  describe('add error', () => {
    it('Get the proper status for the custom error', () => {
      const mapperInstance = mapper(manifest())
      mapperInstance.addError(TestError, TEST_STATUS)
      expect(mapperInstance.getErrorStatus(new TestError())).toEqual(TEST_STATUS)
    })
  })
  describe('Default errors', () => {
    const mapperInstance = mapper(manifest())
    each(mapperInstance._map, (types, code) => {
      describe(`${code}`, () => {
        each(types, T => {
          it(`Should map type ${typeof T} to ${code}`, () => {
            expect(mapperInstance.getErrorStatus(new T())).toEqual(parseInt(code, 0))
          })
        })
      })
    })
  })
})
