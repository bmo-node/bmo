import loadDependency from './loadDependency';
import compose from './compose';

const DEPENDENCY_PROPERTY = 'dependencies';

export default async (config, dependencies) => {
	const formedManifest = await compose(
		Object.keys(dependencies)
			.map((key) => async (manifest) => loadDependency(manifest, key, dependencies[key], dependencies, {}, DEPENDENCY_PROPERTY))
	)({
		config,
		[DEPENDENCY_PROPERTY]: {}
	});
	return formedManifest;
};
