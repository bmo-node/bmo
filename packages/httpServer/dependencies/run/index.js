export default ({
  config,
  dependencies: {
    logger
  }
}) => async () => logger.info(`Server started on ${config.get('server.port')}`)

