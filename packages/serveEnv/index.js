export default ({
	config: {
		environment,
		routes: {
			environment: path = '/api/environment/v1'
		}
	},
	dependencies: { routes }
}) => {
	routes.push({
		path,
		method: 'GET',
		handler: (ctx) => {
			ctx.body = environment;
		}
	});
};
