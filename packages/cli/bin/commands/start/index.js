#!/usr/bin/env node
import httpServer from '@lmig/bmo-http-server';
import es6require from '@lmig/bmo-es6-require';
import commander from 'commander';
import dev from './dev';
import release from './release';

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
		dev({ args: commander, cwd });
	} else {
		release({ args: commander, cwd });
	}
} catch (e) {
	console.error('Unable to load configuration. Ensure that a config directory is in the current directory');
	console.error(e);
	process.exit(1);
}
