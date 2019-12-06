import paginator from '.';
const host = 'localhost';
const resource = '/thing';
const formatUrl = (host, resource, offset, limit, params) => `${host}${resource}?offset=${offset}&limit=${limit}${params}`;
describe('paginator', () => {
	const paginatorInstance = paginator({
		config: {
			server: { host }
		}
	});
	const params = { test: '1' };
	const emptyParams = '';
	const expectedParams = `&test=${params.test}`;
	const total = 100;
	const offset = 0;
	const limit = 10;
	it('Should return the next link when there is another page available', () => {
		const links = paginatorInstance({ total, offset, limit, resource, params });
		expect(links.next).toEqual(formatUrl(host, resource, offset + limit, limit, expectedParams));
	});

	it('Should not return the next link when there is no other page available', () => {
		const links = paginatorInstance({ total, offset: 95, limit, resource });
		expect(links.next).toEqual(undefined);
	});

	it('Should return the prev link when there is a previous page available', () => {
		const testOffset = 50;
		const links = paginatorInstance({ total, offset: testOffset, limit, resource });
		expect(links.prev).toEqual(formatUrl(host, resource, (testOffset - limit), limit, emptyParams));
	});

	it('Should not return the prev link when there is no previous page available', () => {
		const links = paginatorInstance({ total, offset: 0, limit, resource });
		expect(links.prev).toEqual(undefined);
	});

	it('Should return the offset as 0 when there is a previous page available below the limit', () => {
		const links = paginatorInstance({ total, offset: 5, limit, resource });
		expect(links.prev).toEqual(formatUrl(host, resource, 0, limit, emptyParams));
	});
});
