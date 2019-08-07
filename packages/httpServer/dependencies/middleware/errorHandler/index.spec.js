import httpStatus from 'http-status-codes';
import handler from '.';
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = httpStatus;
const errorMap = {
	[BAD_REQUEST]: [Error]
};
class MockError {}
const message = 'error!';
describe('Error Handler', () => {
	it('Should set the status from the error map', () => {
		const mw = handler({ config: { errorMap } });
		const next = () => { throw new Error(message); };
		const ctx = { body: {} };
		mw(ctx, next);
		expect(ctx.status).toEqual(BAD_REQUEST);
	});

	it('Should default to 500(Internal Server Error) with no map', () => {
		const mw = handler({ config: {} });
		const next = () => { throw new Error(message); };
		const ctx = { body: {} };
		mw(ctx, next);
		expect(ctx.status).toEqual(INTERNAL_SERVER_ERROR);
	});

	it('Should default to 500(Internal Server Error) with a map', () => {
		const mw = handler({ config: { errorMap: { [BAD_REQUEST]: [MockError] } } });
		const next = () => { throw new Error(message); };
		const ctx = { body: {} };
		mw(ctx, next);
		expect(ctx.status).toEqual(INTERNAL_SERVER_ERROR);
	});

	it('Should return the message in the body', () => {
		const mw = handler({ config: { errorMap } });
		const next = () => { throw new Error(message); };
		const ctx = { body: {} };
		mw(ctx, next);
		expect(ctx.body.message).toEqual(message);
	});

	it('Should have no message if there is no error message', () => {
		const mw = handler({ config: { errorMap } });
		const next = () => { throw new Error(); };
		const ctx = { body: {} };
		mw(ctx, next);
		expect(ctx.body.message).toEqual(undefined);
	});
});
