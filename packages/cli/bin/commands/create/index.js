#!/usr/bin/env node
import commander from 'commander';
import dependency from './dependency';
import project from './project';
import resource from './resource';
import loadExtensions from './loadExtensions';
const supportedTemplates = {
	project,
	dependency,
	resource
};

let template, name;

commander
	.arguments('<template> <name>', 'creates a BMO http application')
	.action((t, n) => {
		console.log(t, n);
		template = t;
		name = n;
	});

commander.parse(process.argv);

const run = async () => {
	const extensionPackages = await loadExtensions();
	console.log(extensionPackages);
	if (supportedTemplates[template]) {
		// supportedTemplates[template](name);
	} else {
		throw new Error(`Unsupported template type ${template}`);
	}
};

run();
