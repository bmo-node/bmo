import connectionPool from './connectionPool';
import execute from './execute';
const oracledb = require('oracledb');

export default async ({
	config,
	dependencies: {
		logger,
		events,
		bmo: {
			di: {
				context
			}
		}
	}
}) => (await context()
	.config(config)
	.dependencies({
		logger: () => logger,
		events: () => events,
		oracledb: () => oracledb,
		connectionPool,
		execute
	})
	.build())
	.expose({
		connectionPool: true,
		execute: true
	})
	.module();
