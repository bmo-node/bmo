export default async ({
	config: {
		oracledb: {
			connectString,
			user,
			password,
			poolAlias = 'database',
			poolMax = 15,
			autoCommit = true
		},
		events: { shutdown }
	},
	dependencies: {
		logger,
		events,
		oracledb
	}
}) => {
	try {
		console.log(connectString, user, oracledb);
		await oracledb.createPool({
			connectString,
			user,
			password,
			poolAlias,
			poolMax
		});
		oracledb.autoCommit = autoCommit;
		oracledb.outFormat = oracledb.OBJECT;
		logger.info('Creating Connection Pool');
	} catch (e) {
		logger.info('Error starting pool');
		console.error(e);
		process.exit(1);
	}
	events.on(shutdown, async () => {
		logger.info('Closing pool');
		const pool = await oracledb.getPool('database');
		await pool.close(0);
	});
	return {
		getConnection: async () => {
			logger.info('Got connection');
			const connection = await oracledb.getConnection('database');
			return connection;
		},
		closeConnection: async (connection) => {
			await connection.close();
			logger.info('Closed connection');
		}
	};
};
