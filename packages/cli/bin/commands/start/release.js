import fs from 'fs';
import es6require from '@lmig/bmo-es6-require';
import server from './server';

export default ({ args = {}, cwd }) => {
	let config = {};
	try {
		const configPath = args.configDir || `${cwd}/config/index.js`;
		// TODO Escape hatch to change config directory
		if (fs.existsSync(configPath)) {
			const fullPath = require.resolve(configPath);
			config = es6require(fullPath);
		} else {
			config = async () => ({
				eureka: {
					enabled: false
				}
			});
		}
	} catch (e) {
		console.error('Unable to load configuration. Ensure that a config directory is in the current directory');
		console.log(e);
		process.exit(1);
	}
	server({ config, args, cwd });
};
