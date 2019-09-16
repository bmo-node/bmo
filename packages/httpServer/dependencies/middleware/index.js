
import bodyparser from 'koa-bodyparser';
import logger from 'koa-pino-logger';
import helmet from 'koa-helmet';
import errorHandler from './errorHandler';
export default [
	// Already a module so no need to wrap it
	errorHandler,
	({ config: {
		server: {
			helmet: helmetConfig = {
				frameguard: {
					action: 'SAMEORIGIN'
				}
			}
		}
	}
	}) => helmet(helmetConfig),
	() => bodyparser(),
	() => logger()
];
