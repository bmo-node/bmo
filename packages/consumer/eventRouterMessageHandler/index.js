export default ({
  dependencies: {
    jsonMessageHandler,
    commit
  }
}) => (eventMap, eventEmitter, consumer) => jsonMessageHandler(async message => {
  if (eventMap[message.eventType]) {
    try {
      await eventMap[message.eventType](message.payload)
      await commit(consumer)
      eventEmitter.emit('routed', message)
    } catch (e) {
      eventEmitter.emit('error', e)
    }
  } else {
    eventEmitter.emit('ignored', message)
  }
})
