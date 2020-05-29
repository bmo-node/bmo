import bundle from '@b-mo/bundle'

const run = async () => {
  const b = await bundle.load()
  b.run()
}

run()
