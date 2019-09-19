import execute from './execute';
const mockReturn = {
	rows: [ { row1: 'val1' } ]
};
const statement = 'statement';
const bindings = { id: 'blah' };

const executeDB = jest.fn(() => mockReturn);
const getConnection = jest.fn((_, __) => ({ execute: executeDB }));
const closeConnection = jest.fn();
const manifest = {
	dependencies: {
		connectionPool: {
			getConnection,
			closeConnection
		}
	}
};
let prep;
describe('execute', () => {
	describe('#execute', () => {
		beforeEach(async () => {
			prep = await execute(manifest);
			executeDB.mockClear();
		});
		it('should execute the statement passed to it', async () => {
			const actual = await prep(statement);
			expect(actual).toEqual(mockReturn);
		});
		it('should call execute with an empty object if no bindings are passed', async () => {
			await prep(statement);
			expect(executeDB).toHaveBeenCalledWith(statement, {});
		});
		it('should call execute with a statement and bingings', async () => {
			await prep(statement, bindings);
			expect(executeDB).toHaveBeenCalledWith(statement, bindings);
		});
	});
});
