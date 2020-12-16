export default async ({
  config: {
    mongodb: {
      user,
      password,
      url,
      databases,
      poolSize = 20
    },
    events: { shutdown }
  },
  dependencies: {
    logger,
    events,
    mongodb: {
      MongoClient
    }
  }
}) => {
  try {
    const client = await MongoClient.connect(url, {
      auth: user ? {
        password,
        user
      } : undefined,
      poolSize,
      useUnifiedTopology: true
    })
    logger.info(`Connected to ${url}`)
    const temp = Object.keys(databases).map(db => client.db(db)).reduce((acc, db) => Object.assign(acc, { [db.namespace]: db }), {})
    events.on(shutdown, async () => {
      await Object.values(temp).forEach(db => db.close())
      logger.info('Closing Mongo Database connections')
    })
    return temp
  } catch (e) {
    logger.error(`Failed to Connect to ${url}`)
    logger.error(e)
    throw e
  }
}
