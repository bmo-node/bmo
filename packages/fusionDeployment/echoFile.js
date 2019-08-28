#!/usr/bin/env node
const commander = require('commander');

commander
	.arguments('<message>', 'Log a message')
	.action((message) => {
		console.log(message);
	}); ;

commander.parse(process.argv);
