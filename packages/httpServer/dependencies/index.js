import events from './events';
import eureka from './eureka';
import eurekaClient from './eurekaClient';
import dnaClient from './dnaClient';
import gracefulShutdown from './gracefulShutdown';
import middleware from './middleware';
import requestValidator from './requestValidator';
import swagger from './swagger';
import createSwaggerDefinition from './swagger/createSwaggerDefinition';

export default {
	dnaClient,
	events,
	eureka,
	eurekaClient,
	gracefulShutdown,
	middleware,
	requestValidator,
	swagger,
	createSwaggerDefinition
};
