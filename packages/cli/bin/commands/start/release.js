import server from './server';
import es6require from '@lmig/bmo-es6-require';
export default ({ args = {}, cwd }) => {
	let config;
	try {
		const configPath = args.configDir || `${cwd}/config`;
		// TODO Escape hatch to change config directory
		config = es6require(require.resolve(configPath));
	} catch (e) {
		console.error('Unable to load configuration. Ensure that a config directory is in the current directory');
		console.log(e);
		process.exit(1);
	}
	server({ config, args, cwd });
};
