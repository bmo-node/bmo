import loadDependency from './loadDependency';
import compose from './compose';
import context from './context';
const DEPENDENCY_PROPERTY = 'dependencies';

const inject = async (config, dependencies) => {
	dependencies.bmo = () => ({
		di: {
			inject,
			context
		}
	});
	const formedManifest = await compose(
		Object.keys(dependencies)
			.map((key) => async (manifest) => loadDependency(manifest, key, dependencies[key], dependencies, {}, DEPENDENCY_PROPERTY))
	)({
		config,
		[DEPENDENCY_PROPERTY]: {}
	});
	return formedManifest;
};

export default inject;
