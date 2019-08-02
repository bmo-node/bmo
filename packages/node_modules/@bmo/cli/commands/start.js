#!/usr/bin/env node
import httpServer from '@bmo/httpServer';
import es6require from '@bmo/es6Require';
import commander from 'commander';
import startDev from '@bmo/cli/startDev';
import startRelease from '@bmo/cli/startRelease';

commander
	.option('-p, --port', 'override the port')
	.option('--baseDir', 'Set the base directory')
	.option('-c, --configDir', 'Set the configuration directory')
	.option('-d, --dev', 'Starts a watch on the base directory to look for changes');

const cwd = process.cwd();
commander.parse(process.argv);
try {
	if (commander.dev) {
		console.log('starting dev...');
		startDev({ args: commander, cwd });
	} else {
		startRelease({ args: commander, cwd });
	}
} catch (e) {
	console.error('Unable to load configuration. Ensure that a config directory is in the current directory');
	console.error(e);
	process.exit(1);
}
