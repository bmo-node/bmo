/*
 * Copyright (c) 2017, Liberty Mutual
 * Proprietary and Confidential
 * All Rights Reserved
 */

import Eureka from 'eureka-client';
export const createConfig = ({
	serviceUrl,
	name,
	ip,
	port,
	hostname
}) => ({
	instance: {
		app: name,
		hostName: hostname,
		ipAddr: ip,
		homePageUrl: `http://${hostname}:${port}`,
		statusPageUrl: `http://${hostname}:${port}/info`,
		healthCheckUrl: `http://${hostname}:${port}/health`,
		port: {
			$: port,
			'@enabled': true
		},
		vipAddress: name,
		dataCenterInfo: {
			'@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
			name: 'MyOwn'
		}
	},
	eureka: {
		serviceUrl,
		fetchRegistry: true
	}
});
let eurekaClient;
export default ({
	config: {
		server: {
			ip,
			port,
			hostname
		},
		pkg: { name },
		eureka: {
			enabled = false,
			serviceUrl = 'debug'
		}
	}
}) => {
	if (!enabled) {
		return {};
	}

	// Exposed as a singleton so that other clients aren't created to fetch the same registry excessively
	if (eurekaClient) {
		return eurekaClient;
	}

	eurekaClient = new Eureka(createConfig({
		ip,
		port,
		hostname,
		name,
		serviceUrl
	}));
	return eurekaClient;
};
