export default {
  extends: {
    extends: `${__dirname}/extension.js`,
    buz: {}
  },
  dependencies: {
    bar: {},
    run: () => jest.fn()
  }
}
