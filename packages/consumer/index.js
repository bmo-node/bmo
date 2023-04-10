import commit from './commit'
import consumer from './consumer'
import eventRouter from './eventRouter'
import eventRouterMessageHandler from './eventRouterMessageHandler'
import jsonMessageHandler from './jsonMessageHandler'
import run from './run'
import bmoKafka from '@b-mo/kafka'
export default {
  dependencies: {
    bmoKafka,
    logger: () => ({
      info: console.log,
      error: console.log
    }),
    commit,
    consumer,
    eventRouterMessageHandler,
    eventRouter,
    jsonMessageHandler,
    run
  }
}
