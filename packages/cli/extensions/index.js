import loadExtensions from './loadExtensions';
import { transform, each } from 'lodash';

const ExtenstionTypes = {
	commands: 'commands',
	templates: 'templates'
};
const getExtensionsForType = (extensionPackages, type) =>
	transform(extensionPackages, (accumulator, mod, moduleName) => {
		const templates = Object.keys(mod[type]);
		each(mod[type], (template, name) => {
			template.__moduleName = moduleName;
			let key = name;
			if (accumulator[key]) {
				key = `${moduleName}.${name}`;
				if (accumulator[key]) {
					throw new Error(`Duplicate ${type} key ${name} in namespace ${moduleName}`);
				}
				accumulator[key] = mod;
				// rename the other one
				const other = accumulator[name];
				const otherKey = `${other.__moduleName}.name`;
				accumulator[otherKey] = other;
				Object.defineProperty(accumulator, name, {
					get: () => {
						throw new Error(`Duplicate ${type} key ${name}, Use ${key} or ${otherKey} instead`);
					}
				});
				console.warn(`Duplicate ${type} found for ${name}. Use ${key} when trying to invoke this ${type}`);
			} else {
				accumulator[key] = template;
			}
		});
		return accumulator;
	}, {});

const getExtensionTemplates = (extensionPackages) => getExtensionsForType(extensionPackages, ExtenstionTypes.templates);

const getExtensionCommands = (extensionPackages) => getExtensionsForType(extensionPackages, ExtenstionTypes.commands);

export default async () => {
	const packages = await loadExtensions();
	const templates = getExtensionTemplates(packages);
	const commands = getExtensionCommands(packages);
	return {
		templates,
		commands,
		packages
	};
};
