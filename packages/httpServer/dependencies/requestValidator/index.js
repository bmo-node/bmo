import { isFunction } from 'lodash';
// TODO Error typing
export default () => (schema) => {
	if (!isFunction(schema.validate)) {
		throw new Error('Schema must have a validate function');
	}
	return async (ctx, next) => {
		const result = schema.validate(ctx.request.body);
		if (result.error) {
			throw new Error(`Invalid request: ${result.error.annotate()}`);
		}
		/* eslint-disable-next-line callback-return */
		await next();
	};
};
