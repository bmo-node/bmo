import oracledb from 'oracledb';
import connectionPool from '.';

const pool = {
	key: 'database'
};

const connection = {
	key: 'connection',
	close: jest.fn()
};

const events = {
	on: jest.fn(() => {}),
	shutdown: {}
};

const config = {
	oracledb: {
		connectString: 'connectString',
		user: 'user',
		password: 'password'
	},
	events
};

const dependencies = {
	logger: {
		info: msg => console.log(msg)
	},
	events,
	oracledb
};

const params = {
	config,
	dependencies
};

jest.spyOn(oracledb, 'getConnection').mockResolvedValue(connection);
const mockExit = jest.spyOn(process, 'exit').mockReturnValue(() => {});

describe('connectionPool', () => {
	describe('#connectionPool', () => {
		it('successfully creates a connection pool', async () => {
			jest.spyOn(oracledb, 'createPool').mockResolvedValue(pool);
			const oraclePool = await connectionPool(params);
			const result = await oraclePool.getConnection();
			expect(result).toEqual(connection);
		});
		it('catches errors when failing to set up a connection pool', async () => {
			jest.spyOn(oracledb, 'createPool').mockRejectedValue({});
			await connectionPool(params);
			expect(mockExit).toHaveBeenCalledWith(1);
		});
		it('successfully closes a connection from the pool', async () => {
			jest.spyOn(oracledb, 'createPool').mockResolvedValue(pool);
			const oraclePool = await connectionPool(params);
			const connection = await oraclePool.getConnection();
			await oraclePool.closeConnection(connection);
			expect(connection.close).toHaveBeenCalled();
		});
	});
});
