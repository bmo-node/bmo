import program from 'commander';
import logo from '../logo';

console.log(logo());
program
	.version('0.1.0')
	.command('start', 'start an application server in the current directory')
	.command('create', 'creates a BMO http application');

program.parse(process.argv);
