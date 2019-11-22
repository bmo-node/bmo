import fs from 'fs';
import es6Require from '@lmig/bmo-es6-require';
import { get, has, merge, isFunction } from 'lodash';
const env = process.env.NODE_ENV;

const loadConfigFile = async (path) => {
	let config;
	if (fs.existsSync(path)) {
		const env = es6Require(path);
		if (isFunction(env)) {
			config = await env();
		} else {
			config = env;
		}
		return config;
	} else {
		console.warn(`File: ${path} not found.`);
	}
};

const load = async (basePath) => {
	const envConfigPath = `${basePath}/${env}.config.js`;
	const defaultConfigPath = `${basePath}/index.js`;
	const envConfig = await loadConfigFile(envConfigPath);
	const defaultConfig = await loadConfigFile(defaultConfigPath);
	const merged = merge({}, defaultConfig, envConfig);
	merged.get = (path) => get(merged, path);
	merged.has = (path) => has(merged, path);
	return merged;
};
export { load };
