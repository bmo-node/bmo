import resolveBundle from '.'
describe('resolve bundle', () => {
  it('Should recursively merge the bundles together', () => {
    const bundle = {
      extends: {
        extends: {
          extends: require.resolve('./test.bundle.js'),
          dependencies: {
            baz: {},
            middle: [ 'thing1' ]
          }
        },
        dependencies: {
          bar: {},
          middle: [ 'thing2' ]

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
        baz: {},
        buz: {},
        boo: {},
        bim: {},
        middle: [ 'thing1', 'thing2' ]
      }
    }
    const resolvedBundle = resolveBundle({ bundle, cwd: __dirname })
    expect(resolvedBundle).toEqual(expected)
  })
})
