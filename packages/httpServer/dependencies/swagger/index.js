
import ui from './ui';
import httpMethods from 'http-methods-enum';
import httpStatus from 'http-status-codes';
const { OK } = httpStatus;
const { GET } = httpMethods;
export default async ({
	config,
	dependencies: {
		routes = [],
		createSwaggerDefinition
	}
}) => {
	const {
		swagger: {
			urls
		}
	} = config;

	const title = config.pkg.name;
	const { description, version } = config.pkg;
	const contact = config.pkg.author;
	const swaggerDef = createSwaggerDefinition([...routes], { title, description, contact, version });
	const docsRoute = {
		path: urls.docs,
		method: GET,
		handler: (ctx) => {
			ctx.body = swaggerDef;
			ctx.status = OK;
		}
	};
	const uiRoute = {
		path: urls.ui,
		method: GET,
		handler: (ctx) => {
			ctx.body = ui(urls);
			ctx.status = OK;
		}
	};
	routes.push(docsRoute, uiRoute);
};
