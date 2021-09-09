import client from './client'
import producer from './producer'
import consumer from './consumer'
import kafka from 'kafka-node'
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
    kafka: () => kafka,
    client,
    producer,
    consumer
  })
  .expose({
    client: true,
    producer: true,
    consumer: true
  })
  .module()
