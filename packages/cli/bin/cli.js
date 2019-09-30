import program from 'commander';
import pkg from '../package.json';
import logo from '../logo';
import extensions from '../extensions';
import loadCommands from './loadCommands';

console.log(logo());
console.log(`BMO CLI v${pkg.version}`);

const run = async () => {
	const ext = await extensions();
	await loadCommands({ program, extensions: ext });
	program
		.version('0.1.0')
		.command('start', 'start an application server in the current directory')
		.command('create', 'creates a BMO http application')
		.command('add', 'adds a npm module to the bmo dependencies, and installs if it is not in the package.json');
	program.parse(process.argv);
};

run();
