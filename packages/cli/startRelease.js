import startServer from '@bmo/cli/startServer';
import es6require from '@bmo/es6require';
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
	startServer({ config, args, cwd });
};
