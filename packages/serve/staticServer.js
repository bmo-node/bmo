import commander from 'commander';
import release from './release';

function collect (value, previous) {
	return previous.concat([value]);
}

commander
	.option('--baseDir <dir>', 'Set the base directory')
	.option('-c, --configDir <dir>', 'Set the configuration directory')
	.option('-s, --serve <folder>', 'Adds a folder to be served statically', collect, []);
commander.parse(process.argv);

const cwd = process.cwd();
release({
	cwd,
	args: {
		serve: commander.serve
	}
});
