import handler from '.';
class MockError {}
const TEST_STATUS = 420;
const errorMap = {
	getErrorStatus: () => TEST_STATUS
};
describe('Error Handler', () => {
	it('Should set the status from the errorMap when an error is thrown', async () => {
		const mw = handler({ dependencies: { errorMap } });
		const next = jest.fn(() => { throw new MockError(); });
		const ctx = {};
		await mw(ctx, next);
	});
});
