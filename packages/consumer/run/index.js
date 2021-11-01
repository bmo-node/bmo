export default ({
  dependencies: {
    eventRouter,
    eventMap,
    consumer
  }
}) => () => {
  console.log('Starting consumer')
  const router = eventRouter(consumer, eventMap)
  return router
}
