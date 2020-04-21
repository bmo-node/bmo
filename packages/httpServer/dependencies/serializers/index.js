import pinoHttp from 'pino-http';

export default {
	req: () => pinoHttp.stdSerializers.req,
	res: () => pinoHttp.stdSerializers.res,
	err: () => pinoHttp.stdSerializers.err
};
