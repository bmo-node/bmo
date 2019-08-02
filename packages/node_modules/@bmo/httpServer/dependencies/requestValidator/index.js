import { isFunction } from 'lodash';
// TODO Error typing
export default () => (schema) => {
	if (!isFunction(schema.validate)) {
		throw new Error('Schema must have a validate function');
	}
	return (ctx, next) => {
		const result = schema.validate(ctx.req.body);
		if (result.error) {
			throw new Error(`Invalid request: ${result.error.annotate()}`);
		}
	};
};
