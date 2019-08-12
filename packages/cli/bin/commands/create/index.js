#!/usr/bin/env node
import commander from 'commander';
import dependency from './dependency';
import project from './project';
import resource from './resource';
const supportedTemplates = {
	project,
	dependency,
	resource
};
let template, name;
commander
	// .command('create')
	.arguments(' <template> <name>', 'creates a BMO http application')
	.action((t, n) => {
		console.log(t, n);
		template = t;
		name = n;
	});
commander.parse(process.argv);

console.log(commander);
if (supportedTemplates[template]) {
	supportedTemplates[template](name);
} else {
	throw new Error(`Unsupported template type ${template}`);
}
