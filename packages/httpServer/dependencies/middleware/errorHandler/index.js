import { each } from 'lodash';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
export default ({
	dependencies: {
		errorMap
	}
}) => async (ctx, next) => {
	try {
		// there is no return value not sure what eslint wants here
		/* eslint-disable-next-line callback-return */
		await next();
	} catch (e) {
		ctx.status = errorMap.getErrorStatus(e);
		if (e.message) {
			ctx.body = {
				message: e.message
			};
		}
	}
	return ctx;
};
