import {
	map,
	set,
	has,
	isFunction,
	isObject
} from 'lodash';
import extractDependencies from './extractDependencies';
import compose from '../compose';

const loadDependency = async (manifest, name, dependency, dependencies, depChain, path = [], dependencyProperty) => {
	const fullPath = path.length > 0 ? `${path.join('.')}.${name}` : name;
	const dependencyPath = `${dependencyProperty}.${fullPath}`;
	if (has(manifest, dependencyPath)) {
		return manifest;
	}
	if (isFunction(dependency)) {
		const deps = extractDependencies(dependency, dependencyProperty);
		await compose(deps.map((dep) => async (manifest) => {
			if (!manifest[dependencyProperty][dep] && dep !== name) {
				// if (depChain[dep]) {
				//  throw new Error(`circular dependency detected. ${dep} is already in ${name}'s dependency chain. ${JSON.stringify(depChain, 0, 2)}`);
				// }
				if (!dependencies[dep]) {
					throw new Error(`Unknown dependency ${dep} in module: ${fullPath.join('.')}${name}`);
				}
				depChain[dep] = true;
				// manifest[dependencyProperty][dep] = loadDependency(manifest, dep, dependencies[dep], dependencies, depChain);
				manifest = await loadDependency(manifest, dep, dependencies[dep], dependencies, depChain, [], dependencyProperty);
			}
			return manifest;
		}))(manifest);
		if (!has(manifest, dependencyPath)) {
			const value = await dependency(manifest);
			set(manifest, `${dependencyProperty}.${fullPath}`, value);
		}
	} else if (isObject(dependency)) {
		path.push(name);
		await compose(
			map(dependency, (dep, subName) => async (manifest) => loadDependency(manifest, subName, dep, dependencies, depChain, path, dependencyProperty))
		)(manifest);
	} else if (Array.isArray(dependency)) {
		path.push(name);
		await compose(
			map(dependency, (dep, index) => async (manifest) => loadDependency(manifest, `[${index}]`, dep, dependencies, depChain, path, dependencyProperty))
		)(manifest);
	} else {
		throw new Error(`Dependency ${path.join('.')}.${name} must be either a function, object, or array. type ${typeof dependency} not injectable`);
	}
	return manifest;
};

export default loadDependency;
