export default {
	di: {
		namespace: 'dependencies'
	},
	server: { port: 3000 },
	swagger: {
		urls: {
			docs: '/api/docs',
			ui: '/docs'
		}
	},
	events: {
		shutdown: 'app.shutdown'
	},
	eureka: {
		enabled: true,
		loggerLevel: 'debug'
	}
};
