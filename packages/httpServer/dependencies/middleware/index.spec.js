import middleware from '.';

describe('middleware', () => {
	it('Should be a function', () => {
		expect(typeof middleware).toEqual('function');
	});
	it('Should return an array when called', async () => {
		const mw = await middleware({ config: {}, dependencies: {} });
		expect(Array.isArray(mw)).toBeTruthy();
	});
});
