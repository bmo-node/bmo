import { resolveBundle } from './runApp'
describe('resolve bundle', () => {
  it('Should recursively merge the bundles together', () => {
    const bundle = {
      extends: {
        extends: {
          dependencies: {
            baz: {}
          }
        },
        dependencies: {
          bar: {}
        }
      },
      dependencies: {
        foo: {}
      }
    }
    const expected = {
      dependencies: {
        foo: {},
        bar: {},
        baz: {}
      }
    }
    const resolvedBundle = resolveBundle(bundle)
    expect(resolvedBundle).toEqual(expected)
  })
})
