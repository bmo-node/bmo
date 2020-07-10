import bundle from '.'

it('Should load the bundle and run the dependencies', async () => {
  let b = bundle({ dir: `${__dirname}/testBundles/dependenciesOnly` })
  await b.run()
  expect(b.manifest.dependencies.run).toHaveBeenCalled()
})

it('Should load the bundle and run the index file', async () => {
  let b = bundle({ dir: `${__dirname}/testBundles/indexFile` })
  await b.run()
  expect(b.manifest.dependencies.run).toHaveBeenCalled()
})

it('Should load the bundle and run the main file', async () => {
  let b = bundle({ dir: `${__dirname}/testBundles/mainFile` })
  await b.load()
  await b.run()
  expect(b.manifest.dependencies.run).toHaveBeenCalled()
})

it('Default to the current working directory if one is not defined', async () => {
  let b = bundle()
  try {
    await (b.run())
  } catch (_) {} // Appease the unused eslint rule...

  expect(b.cwd).toEqual(process.cwd())
})

it('Should throw an error when there is no run function', async () => {
  let b = bundle({ dir: `${__dirname}/testBundles/indexFile` })
  await b.load()
  delete b.bundle.dependencies.run
  expect(b.run()).rejects.toThrow(Error)
})

it('Should throw an error when there are no dependencies defined', async () => {
  let b = bundle({ dir: `${__dirname}/testBundles/noDependencies` })
  let err
  try {
    await b.load()
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})

it('Should throw an error when the bundle is not valid', async () => {
  let b = bundle({ dir: `${__dirname}/testBundles/nothing` })
  let err
  try {
    await b.load()
  } catch (e) {
    err = e
  }

  expect(err).toBeInstanceOf(Error)
})
