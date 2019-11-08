#!/usr/bin/env node
import commander from 'commander';
import dev from './dev';
import { fork } from 'child_process';
import logger from '../../../logger';
const esm = require.resolve('esm');

function collect (value, previous) {
	return previous.concat([value]);
}
commander
	.option('--baseDir <dir>', 'Set the base directory')
	.option('-c, --configDir <dir>', 'Set the configuration directory')
	.option('-d, --dev', 'Starts a watch on the base directory to look for changes')
	.option('-s, --serve <folder>', 'Adds a folder to be served statically', collect, []);
logger.warn('bmo start will be deprecated in v0.3.0, you will instead have to install: @lmig/bmo-extension-server and use that for server capabilities');

const cwd = process.cwd();
commander.parse(process.argv);
try {
	if (commander.dev) {
		console.log('starting dev...');
		dev({ args: commander, cwd });
	} else {
		fork(`${__dirname}/staticServer.js`, { cwd, execArgv: [ '-r', esm ] });
	}
} catch (e) {
	console.error('Unable to load configuration. Ensure that a config directory is in the current directory');
	console.error(e);
	process.exit(1);
}
