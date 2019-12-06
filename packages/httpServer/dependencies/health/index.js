import { OK } from 'http-status-codes';
import httpMethods from 'http-methods-enum';
const { GET } = httpMethods;
export const handler = (ctx, next) => {
	ctx.body = { health: 'OK' };
	ctx.status = OK;
};

export const error = (ctx, next) => {
	throw new Error('You get an error!');
};

export default ({ dependencies: { routes } }) => {
	routes.push({
		method: GET,
		name: 'Health Check',
		path: '/health',
		handler
	});
	routes.push({
		method: GET,
		name: 'Get Error',
		path: '/error',
		handler: error
	});
};
