import inject, { extract } from '@lmig/bmo-injector';
import es6Require from '@lmig/bmo-es6-require';
import { set, get, has, flatten, merge } from 'lodash';
import { load } from '@lmig/bmo-config';
// This will probably break with circular dependencies...
const getDependencies = (module, dependencies) => {
	let deps = extract(module);
	const subdeps = deps.map((d) => {
		const moduleName = getDependencyModuleName(d, dependencies);
		return getDependencies(get(dependencies, moduleName), dependencies);
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
		moduleName = s.join('.');
	}
	if (moduleName.length === 0) {
		throw new Error(`No dependency in path ${d} found`);
	}
	return moduleName;
};

export default ({ config: userConfig = {}, dependencies = {}, mocks = {} } = {}) => {
	dependencies = dependencies || es6Require(`${process.cwd()}/dependencies`);
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
			const appConfig = await (es6Require(`${process.cwd()}/config`))();
			const config = merge({}, appConfig, userConfig);
			const deps = getDependencies(module, dependencies);
			const bundle = {};
			deps.forEach((dep) => {
				const moduleName = getDependencyModuleName(dep, dependencies);
				if (has(mocks, moduleName)) {
					set(bundle, moduleName, () => get(mocks, moduleName));
				}
				bundle[moduleName] = get(dependencies, moduleName);
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
