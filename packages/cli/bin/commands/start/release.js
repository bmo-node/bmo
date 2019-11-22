import fs from 'fs';
import dotenv from 'dotenv';
import { load } from '@lmig/bmo-config';
import server from './server';
dotenv.config();

export default ({ args = {}, cwd }) => {
	let config = {};
	try {
		const configPath = args.configDir || `${cwd}/config`;
		// TODO Escape hatch to change config directory
		if (fs.existsSync(configPath)) {
			config = async () => load(configPath);
		} else {
			config = async () => ({});
		}
	} catch (e) {
		console.error('Unable to load configuration. Ensure that a config directory is in the current directory');
		console.log(e);
		process.exit(1);
	}
	server({ config, args, cwd });
};
