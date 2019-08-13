import createSwaggerDefinition from './swagger/createSwaggerDefinition';
import dnaClient from './dnaClient';
import errors from './errors';
import errorMap from './errorMap';
import events from './events';
import eureka from './eureka';
import eurekaClient from './eurekaClient';
import gracefulShutdown from './gracefulShutdown';
import middleware from './middleware';
import requestValidator from './requestValidator';
import swagger from './swagger';
import serveStatic from './serveStatic';

export default {
	createSwaggerDefinition,
	dnaClient,
	errors,
	errorMap,
	eureka,
	eurekaClient,
	events,
	gracefulShutdown,
	middleware,
	requestValidator,
	serveStatic,
	swagger
};
