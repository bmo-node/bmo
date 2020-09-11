import { has } from 'lodash'
export default ({
  config: {
    server: {
      port,
      staticFiles = []
    }
  },
  dependencies: {
    logger,
    server
  }
}) => async () => {
  logger.info(`Server started on ${port}`)
}
