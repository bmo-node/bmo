import joi from '@hapi/joi'
import Koa from 'koa'
import Router from 'koa-router'
import commander from 'commander'
import pinoHttp from 'pino-http'

import args from './args'
import createSwaggerDefinition from './swagger/createSwaggerDefinition'
import errors from './errors'
import errorMap from './errorMap'
import events from './events'
import gracefulShutdown from './gracefulShutdown'
import health from './health'
import http from './http'
import loadRoute from './loadRoute'
import logger from './logger'
import middleware from './middleware'
import requestValidator from './requestValidator'
import swagger from './swagger'
import serveStatic from './serveStatic'
import serializers from './serializers'
import run from './run'
import server from './server'

export default {
  args,
  commander: () => commander,
  createSwaggerDefinition,
  errors,
  errorMap,
  events,
  gracefulShutdown,
  health,
  http,
  joi: () => joi,
  Koa: () => Koa,
  logger,
  loadRoute,
  middleware,
  pinoHttp: () => pinoHttp,
  requestValidator,
  Router: () => Router,
  run,
  server,
  serializers,
  serveStatic,
  swagger
}
