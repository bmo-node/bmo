import os from 'os';
import ip from 'ip';
export default {
	di: {
		namespace: 'dependencies'
	},
	server: {
		port: 3000,
		ip: ip.address(),
		hostname: os.hostname()
	},
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
