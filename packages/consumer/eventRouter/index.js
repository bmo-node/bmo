import { EventEmitter } from 'events'

export default ({
  dependencies: {
    eventRouterMessageHandler
  }
}) => (consumer, eventMap) => {
  const emitter = new EventEmitter()
  consumer.on('message', eventRouterMessageHandler(eventMap, emitter, consumer))
  return emitter
}
