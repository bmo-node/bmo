import path from 'path';
import serve from './serve';
export default {
	commands: {
		serve: {
			format: 'serve',
			description: 'Starts a BMO service with the module in the current directory',
			action: serve
		}
	}
};
