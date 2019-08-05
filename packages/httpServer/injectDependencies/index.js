import {
	map,
	get,
	set,
	has,
	each,
	isFunction,
	isObject
} from 'lodash';
import extractDependencies from './extractDependencies';
import compose from './compose';

const DEPENDENCY_PROPERTY = 'dependencies';
// TODO
// find a home for the pipe function
// make 'services configurable'
export default async (config, dependencies) => {
	let deps = {};
	const formedManifest = await compose(
		Object.keys(dependencies)
			.map((key) => async (manifest) => await loadDependency(manifest, key, dependencies[key], dependencies, {}))
	)({
		config,
		[DEPENDENCY_PROPERTY]: {}
	});
	deps = formedManifest[DEPENDENCY_PROPERTY];
	return formedManifest;
};

// TODO cleanup and move to external file
