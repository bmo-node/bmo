import { each } from 'lodash';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
export default ({
	config: {
		errorMap = {}
	}
}) => async (ctx, next) => {
	try {
		// there is no return value not sure what eslint wants here
		/* eslint-disable-next-line callback-return */
		await next();
	} catch (e) {
		const type = typeof e;
		ctx.status = INTERNAL_SERVER_ERROR;
		each(errorMap, (types, code) => {
			/* this will be a string since the typeof check is against another typeof check */
			/* eslint-disable-next-line valid-typeof */
			if (types.some(t => typeof t === type)) {
				ctx.status = parseInt(code);
			}
		});
		if (e.message) {
			ctx.body = {
				message: e.message
			};
		}
	}
	return ctx;
};
