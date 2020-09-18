import bundle from '.'

it('Should load the bundle and run the dependencies', async () => {
  let b = await bundle().setRoot(`${__dirname}/testBundles/dependenciesOnly`)
  await b.run()
  expect(b.manifest.dependencies.run).toHaveBeenCalled()
})

it('Should load the bundle and run the index file', async () => {
  let b = await bundle().setRoot(`${__dirname}/testBundles/indexFile`)
  await b.run()
  expect(b.manifest.dependencies.run).toHaveBeenCalled()
})

it('Should load the bundle and run the main file', async () => {
  let b = bundle()
  b.setRoot(`${__dirname}/testBundles/mainFile`)
  await b.load()
  await b.run()
  expect(b.manifest.dependencies.run).toHaveBeenCalled()
})

it('Default to the current working directory if root is not called', async () => {
  let b = bundle()
  expect(b.root).toEqual(process.cwd())
})

it('Should throw an error when there is no run function', async () => {
  let b = bundle()
  b.setRoot(`${__dirname}/testBundles/indexFile`)
  await b.resolve()
  await b.build()
  delete b.manifest.dependencies.run
  expect(b.run()).rejects.toThrow(Error)
})

it('Should throw an error when there are no dependencies defined', async () => {
  let b = bundle()
  let err
  try {
    await b.setRoot(`${__dirname}/testBundles/noDependencies`).load()
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})

it('Should throw an error when the bundle is not valid', async () => {
  let b = bundle().setRoot(`${__dirname}/testBundles/nothing`)
  let err
  try {
    await b.run()
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})

it('Should throw an error when you try to set the dependencies twice', async () => {
  let err
  try {
    bundle()
      .dependencies({ foo: () => () => true })
      .dependencies({ bar: () => () => true })
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})

it('Should throw an error when you try to set the config twice', async () => {
  let err
  try {
    bundle()
      .config({ foo: true })
      .config({ bar: true })
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})

it('Should throw an error when you to set config after loading', async () => {
  let err
  try {
    let b = bundle()
      .setRoot(`${__dirname}/testBundles/dependenciesOnly`)
    await b.load()
    b.config({ foo: true })
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})

it('Should throw an error when you to set dependencies after loading', async () => {
  let err
  try {
    let b = bundle()
      .setRoot(`${__dirname}/testBundles/dependenciesOnly`)
    await b.load()
    b.dependencies({ foo: () => () => true })
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})

it('Should throw an error when you try to load twice', async () => {
  let err
  try {
    let b = bundle()
      .setRoot(`${__dirname}/testBundles/dependenciesOnly`)
    await b.load()
    await b.load()
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})

it('Should throw an error when you try to build twice', async () => {
  let err
  try {
    let b = bundle()
      .setRoot(`${__dirname}/testBundles/dependenciesOnly`)
    await b.build()
    await b.build()
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})

it('Should override the dependency in the bundle', async () => {
  const b = bundle()
  const mockBar = jest.fn()
  const override = jest.fn()
  b.config({})
    .dependencies({
      foo: ({ dependencies: { bar }}) => () => bar(),
      bar: () => mockBar
    })
  b.override({
    dependencies: {
      bar: () => override
    }
  })
  await b.build()
  b.manifest.dependencies.foo()
  expect(override).toHaveBeenCalled()
  expect(mockBar).not.toHaveBeenCalled()
})
