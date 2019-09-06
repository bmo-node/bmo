import dnaClient from './dnaClient';
import eureka from './eureka';
import eurekaClient from './eurekaClient';

export default async ({
	config,
	dependencies: {
		bmo: {
			di: {
				context
			}
		}
	}
}) => (await context()
	.config(config)
	.dependencies({
		dnaClient,
		eurekaClient,
		eureka
	})
	.build())
	.expose(false)
	.module();
