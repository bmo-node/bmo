
export const createConfiguration = ({ eurekaClient }) => ({
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
export default ({
	config: {
		eureka: {
			enabled = false,
			loggerLevel = 'debug'
		}
	},
	dependencies: {
		eurekaClient,
		dnaClient
	}
}) => {
	if (!enabled) {
		return;
	}

	eurekaClient.logger.level(loggerLevel);
	eurekaClient.start();
	// Configure the resilient client
	// See https://www.npmjs.com/package/resilient#options for details
	dnaClient.setConfiguration(createConfiguration({ eurekaClient }));
};
