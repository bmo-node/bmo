/*
 * Copyright (c) 2017, Liberty Mutual
 * Proprietary and Confidential
 * All Rights Reserved
 */

import os from 'os';
import ip from 'ip';
import Eureka from 'eureka-client';

let eurekaClient;
export default ({
	config: {
		pkg: { name },
		eureka: {
			enabled,
			loggerLevel,
			serviceUrl
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

	eurekaClient = new Eureka({
		instance: {
			app: name,
			hostName: os.hostname(),
			ipAddr: ip.address(),
			homePageUrl: `http://${os.hostname()}:${process.env.PORT}`,
			statusPageUrl: `http://${os.hostname()}:${process.env.PORT}/info`,
			healthCheckUrl: `http://${os.hostname()}:${process.env.PORT}/health`,
			port: {
				$: process.env.PORT,
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
	return eurekaClient;
};
