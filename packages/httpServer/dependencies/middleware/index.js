
import bodyparser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import logger from './logger'
import errorHandler from './errorHandler'
export default [
  // Already a module so no need to wrap it
  errorHandler,
  ({
    config: {
      server: {
        helmet: helmetConfig = {
          frameguard: {
            action: 'SAMEORIGIN'
          }
        }
      }
    }
  }) => helmet(helmetConfig),
  () => bodyparser(),
  logger
]
