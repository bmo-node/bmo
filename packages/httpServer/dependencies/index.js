import events from './events';
import eureka from './eureka';
import eurekaClient from './eurekaClient';
import dnaClient from './eurekaClient';
import gracefulShutdown from './gracefulShutdown';
import middleware from './middleware';
import requestValidator from './requestValidator';
import swagger from './swagger';

export default {
	dnaClient,
	events,
	eureka,
	eurekaClient,
	gracefulShutdown,
	middleware,
	requestValidator,
	swagger
};
