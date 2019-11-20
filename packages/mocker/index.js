import inject, { extract } from '@lmig/bmo-injector';
import es6Require from '@lmig/bmo-es6-require';
import { set, get, has, flatten, merge, isUndefined } from 'lodash';
import { load as loadConfig } from '@lmig/bmo-config';

export default ({ config: userConfig = {}, dependencies: userDeps = {}, mocks = {} } = {}) => {
	const appDeps = es6Require(`${process.cwd()}/dependencies`);
	const dependencies = merge({}, userDeps, appDeps);
	const logger = {
		info: console.log,
		warn: console.warn,
		error: console.error
	};
	dependencies.logger = () => logger;
	return {
		config (path, value) {
			set(userConfig, path, value);
			return this;
		},
		mock (path, mock) {
			set(mocks, path, mock);
			return this;
		},
		async build (module) {
			const appConfig = await loadConfig(`${process.cwd()}/config`);
			const config = merge({}, appConfig, userConfig);
			const deps = getDependencies(module, dependencies);
			const bundle = {};
			deps.forEach((dep) => {
				const moduleName = getDependencyModuleName(dep, dependencies);
				if (!isUndefined(get(mocks, moduleName))) {
					set(bundle, moduleName, () => get(mocks, moduleName));
				} else {
					bundle[moduleName] = get(dependencies, moduleName);
				}
			});
			try {
				const manifest = await inject(config, { ...bundle, module });
				manifest.dependencies.module.manifest = manifest;
				return manifest.dependencies.module;
			} catch (e) {
				logger.error(e);
				throw e;
			}
		}
	};
};

// This will probably break with circular dependencies...
const getDependencies = (module, dependencies, found = {}) => {
	let deps = extract(module);
	if (found[module]) {
		return [];
	}
	found[module] = true;
	const subdeps = deps.map((d) => {
		const moduleName = getDependencyModuleName(d, dependencies);
		return getDependencies(get(dependencies, moduleName), dependencies, found);
	});
	deps = deps.concat(subdeps);
	deps = flatten(deps);
	return deps;
};

const getDependencyModuleName = (modulePath, dependencies) => {
	let moduleName = modulePath;
	while (!has(dependencies, moduleName) && moduleName.length > 0) {
		const s = moduleName.split('.');
		s.pop();
		if (s.length > 1) {
			moduleName = s.join('.');
		} else if (s[0]) {
			moduleName = s[0];
		} else {
			moduleName = '';
		}
	}
	if (moduleName.length === 0) {
		throw new Error(`No dependency in path ${modulePath} found`);
	}
	return moduleName;
};
