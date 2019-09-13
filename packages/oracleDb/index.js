import { Context } from '@lmig/bmo-injector';
import connectionPool from './connectionPool';
import execute from './execute';
const oracledb = require('oracledb');

export default async ({ config, dependencies: { logger, events } }) => {
	const ctx = new Context();
	const built = (await ctx
		.config(config)
		.dependencies({
			logger: () => logger,
			events: () => events,
			oracledb: () => oracledb,
			connectionPool,
			execute
		})
		.build());
	console.log(built);

	return built
		.expose({
			connectionPool: true,
			execute: true
		})
		.module();
};
