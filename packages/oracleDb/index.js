import connectionPool from './connectionPool';
import execute from './execute';
const oracledb = require('oracledb');

export default async ({ config, dependencies: { logger, events, bmo: { di: { context } } } }) => {
	const built = (await context()
		.config(config)
		.dependencies({
			logger: () => logger,
			events: () => events,
			oracledb: () => oracledb,
			connectionPool,
			execute
		})
		.build());

	return built
		.expose({
			connectionPool: true,
			execute: true,
			oracledb: true
		})
		.module();
};
