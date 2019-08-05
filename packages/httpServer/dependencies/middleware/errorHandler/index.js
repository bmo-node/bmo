import { each } from 'lodash';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
export default ({
	config: {
		errorMap = {}
	}
}) => async (ctx, next) => {
	try {
		await next();
	} catch (e) {
		const type = typeof e;
		ctx.status = INTERNAL_SERVER_ERROR;
		each(errorMap, (types, code) => {
			if (types.some(t => typeof t === type) >= 0) {
				ctx.status = parseInt(code);
			}
		});
		if (e.message) {
			ctx.body = {
				message: e.message
			};
		}
	}
};
