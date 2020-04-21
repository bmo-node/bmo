import joi from '@hapi/joi';
import createSwaggerDefinition from './swagger/createSwaggerDefinition';
import errors from './errors';
import errorMap from './errorMap';
import events from './events';
import gracefulShutdown from './gracefulShutdown';
import health from './health';
import logger from './logger';
import middleware from './middleware';
import requestValidator from './requestValidator';
import swagger from './swagger';
import serveStatic from './serveStatic';
import http from './http';
import serializers from './serializers';

export default {
	createSwaggerDefinition,
	errors,
	errorMap,
	events,
	gracefulShutdown,
	health,
	http,
	joi: () => joi,
	logger,
	middleware,
	requestValidator,
	serializers,
	serveStatic,
	swagger
};
