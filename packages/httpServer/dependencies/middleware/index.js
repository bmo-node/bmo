
import bodyparser from 'koa-bodyparser'
import kHelmet from 'koa-helmet'
// Koa helmet does not have access to the default directives
// so import its underlying dependency here and use it directly for the
// default directives.
import helmet from 'helmet'
import { merge } from 'lodash'
import errorMapper from './errorMapper'
import logger from './logger'
import errorHandler from './errorHandler'

export default [
  // Already a module so no need to wrap it
  errorHandler,
  ({
    config: {
      server: {
        mergeDefaultCspDirectives = true,
        helmet: helmetConfig = {
          contentSecurityPolicy: {
            directives: {}
          },
          frameguard: {
            action: 'SAMEORIGIN'
          }
        }
      }
    }
  }) => {
    let { contentSecurityPolicy } = helmetConfig.contentSecurityPolicy
    if (mergeDefaultCspDirectives) {
      contentSecurityPolicy = merge({}, contentSecurityPolicy, { directives: helmet.contentSecurityPolicy.getDefaultDirectives() })
    }

    const config = {
      ...helmetConfig,
      contentSecurityPolicy
    }
    return kHelmet(config)
  },
  ({
    config: {
      server: {
        bodyparser: bodyparserConfig
      }
    }
  }) => bodyparser(bodyparserConfig),
  logger,
  errorMapper
]
