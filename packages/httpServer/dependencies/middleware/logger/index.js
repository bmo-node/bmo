import pinoHttp from 'pino-http';
export default ({ config: { pino: pinoOpts } }) => {
	const wrap = pinoHttp(pinoOpts);
	const pino = async (ctx, next) => {
		wrap(ctx.req, ctx.res);
		ctx.log = ctx.request.log = ctx.response.log = ctx.req.log;
		try {
			await next();
		} catch (e) {
			ctx.log.error({
				res: ctx.res,
				err: {
					type: e.constructor.name,
					message: e.message,
					stack: e.stack
				},
				responseTime: ctx.res.responseTime
			}, 'request errored');
			throw e;
		}
	};
	pino.logger = wrap.logger;
	return pino;
};
