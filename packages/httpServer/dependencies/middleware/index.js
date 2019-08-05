
import bodyparser from 'koa-bodyparser';
import logger from 'koa-pino-logger';
import helmet from 'koa-helmet';
import errorHandler from './errorHandler';
export default async (manifest) => [
	errorHandler(manifest),
	helmet(),
	bodyparser(),
	logger()
];
