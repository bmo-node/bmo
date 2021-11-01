export default async ({
  config: {
    mongodb: {
      databases
    }
  },
  dependencies: { db }
}) => {
  const allCollections = Object.keys(databases)
    .reduce((acc, dbName) => {
      const dbCollections = Object.keys(databases[dbName]).reduce((acc1, collection) => Object.assign(acc1, { [collection]: db[dbName].collection(collection) }), {})
      return Object.assign(acc, { [dbName]: dbCollections })
    }, {})
  return allCollections
}
