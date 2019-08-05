
export default ({
	config: { eureka: { enabled, loggerLevel } },
	dependencies: {
		eurekaClient,
		dnaClient
	}
}) => {
	if (!enabled) {
		return {};
	}

	eurekaClient.logger.level(loggerLevel);
	eurekaClient.start((error) => {
	});
	// Configure the resilient client
	// See https://www.npmjs.com/package/resilient#options for details
	dnaClient.setConfiguration({
		eurekaClient,
		resilientConfig: {
			balancer: {
				roundRobin: true,
				roundRobinSize: 4
			},
			service: {
				retry: 2
			}
		}
	});
};
