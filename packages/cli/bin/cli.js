import program from 'commander';
import logo from '../logo';

console.log(logo());
program
	.version('0.1.0')
	.command('start', 'start an application server in the current directory')
	.command('build', 'build the packages');

program.parse(process.argv);
