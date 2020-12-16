import collections from '.';
const emptyCollection = {};
const mockDb = {
	collection: jest.fn(() => emptyCollection)
};
const db = {
	db1: mockDb
};
const manifest = () => ({
	config: {
		mongodb: {
			databases: {
				db1: {
					col1: 'col1'
				}
			}
		}
	},
	dependencies: {
		db
	}
});
describe('collections', () => {
	let mockManifest;
	beforeEach(() => {
		jest.clearAllMocks();
		mockManifest = manifest();
	});
	it('Should create the schedules collection', async () => {
		const result = await collections(mockManifest);
		const expected = {
			db1: {
				col1: {}
			}
		};
		expect(result).toEqual(expected);
	});
});
