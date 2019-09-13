import {
	map,
	set,
	get,
	has,
	isFunction,
	isObject
} from 'lodash';
import extractDependencies from './extractDependencies';
import compose from '../compose';

const loadDependency = async (manifest, name, dependency, dependencies, depChain, dependencyProperty) => {
	const dependencyPath = `${dependencyProperty}.${name}`;
	console.log(`Loading ${name}`, dependency);
	if (has(manifest, dependencyPath)) {
		return manifest;
	}
	if (isFunction(dependency)) {
		const deps = extractDependencies(dependency, dependencyProperty);
		await compose(deps.map((dep) => async (manifest) => {
			if (!get(manifest, dependencyPath) && dep !== name) {
				// if (depChain[dep]) {
				//  throw new Error(`circular dependency detected. ${dep} is already in ${name}'s dependency chain. ${JSON.stringify(depChain, 0, 2)}`);
				// }
				if (!get(dependencies, dep) && !get(manifest, dep)) {
					const parts = dep.split('.');
					if (parts.length > 1) {
						// covers the case for deeply nested modules.
						const moduleToLoad = parts[0];
						manifest = await (loadDependency(manifest, moduleToLoad, dependencies[moduleToLoad], dependencies, depChain, dependencyProperty));
					} else {
					 throw new Error(`Unknown dependency ${dep} in module: ${name}`);
					}
				}
				depChain[dep] = true;
				manifest = await loadDependency(manifest, dep, get(dependencies, dep), dependencies, depChain, dependencyProperty);
			}
			return manifest;
		}))(manifest);
		if (!has(manifest, dependencyPath)) {
			const value = await dependency(manifest);
			set(manifest, `${dependencyProperty}.${name}`, value);
		}
	} else if (isObject(dependency) && !Array.isArray(dependency)) {
		await compose(
			map(dependency, (dep, subName) => async (manifest) => loadDependency(manifest, `${name}.${subName}`, dep, dependencies, depChain, dependencyProperty))
		)(manifest);
	} else if (Array.isArray(dependency)) {
		await compose(
			map(dependency, (dep, index) => async (manifest) => loadDependency(manifest, `${name}[${index}]`, dep, dependencies, depChain, dependencyProperty))
		)(manifest);
	} else {
		const parts = name.split('.');
		if (parts.length > 1) {
			// covers the case for deeply nested modules.
			const moduleToLoad = parts[0];
			manifest = await (loadDependency(manifest, moduleToLoad, dependencies[moduleToLoad], dependencies, depChain, dependencyProperty));
		} else {
			throw new Error(`Dependency ${name} must be either a function, object, or array. type ${typeof dependency} not injectable`);
		}
	}
	return manifest;
};

export default loadDependency;
