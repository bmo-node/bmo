import db from './db'
import collections from './collections'
import mongodb from 'mongodb'
export default async ({
  config,
  dependencies: {
    logger,
    events,
    bmo: {
      di: {
        context
      }
    }
  }
}) => context()
  .config(config)
  .inherit({
    logger,
    events
  })
  .dependencies({
    mongodb: () => mongodb,
    db,
    collections
  })
  .expose({
    mongodb: true,
    db: true,
    collections: true
  })
  .module()
