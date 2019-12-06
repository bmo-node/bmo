import execute from '.';
const connection = ({ mockResult }) => ({
	execute: jest.fn(() => mockResult),
	close: jest.fn()
});
const manifest = ({ connection }) => ({
	dependencies: {
		connectionPool: {
			getConnection: jest.fn(() => connection),
			closeConnection: jest.fn()
		}
	}
});
describe('execute', () => {
	let result, mockManifest, mockConnection;
	const statement = `some sql statement`;
	const mockResult = [`some data`];
	beforeEach(async () => {
		mockConnection = connection({ mockResult });
		mockManifest = manifest({ connection: mockConnection });
		result = await (await execute(mockManifest))(statement);
	});
	it('Should get a connection from the connection pool', () => {
		expect(mockManifest.dependencies.connectionPool.getConnection).toHaveBeenCalled();
	});
	it('Should return the result from the query execution', () => {
		expect(result).toEqual(mockResult);
	});
	it('Should call execute on the connection with the statement', () => {
		expect(mockConnection.execute).toHaveBeenCalledWith(statement, {});
	});
	it('Should call execute on the connection with the statement', () => {
		expect(mockManifest.dependencies.connectionPool.closeConnection).toHaveBeenCalled();
	});

	describe('With bindings', () => {
		it('should call execute with an empty object if no bindings are passed', async () => {
			expect(mockConnection.execute).toHaveBeenCalledWith(statement, {});
		});
		it('should call execute with a statement and bindings', async () => {
			const bindings = { foo: 'bar' };
			mockConnection = connection({ mockResult });
			mockManifest = manifest({ connection: mockConnection });
			result = await (await execute(mockManifest))(statement, bindings);
			expect(mockConnection.execute).toHaveBeenCalledWith(statement, bindings);
		});
	});
});
