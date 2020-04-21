import dependencies from '.';
describe('Dependencies', () => {
	it('Should export an object by default', () => {
		expect(typeof dependencies).toEqual('object');
	});
});
