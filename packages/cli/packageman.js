import execa from 'execa';
import fs from 'fs-extra';

const yarn = 'yarn';
const npm = 'npm';
const install = 'install';
const add = 'add';
const packageManagers = [yarn, npm];
const shell = true;
const isYarn = fs.existsSync('yarn.lock');

const installCmds = {
	[yarn]: () => {
		const cmd = execa(yarn, [install], { shell });
		cmd.stdout.pipe(process.stdout);
		return cmd;
	},
	[npm]: () => {
		const cmd = execa(npm, [install], { shell });
		cmd.stdout.pipe(process.stdout);
		return cmd;
	}
};

const addCommands = {
	[yarn]: (pkg) => {
		const cmd = execa(yarn, [add, pkg], { shell });
		cmd.stdout.pipe(process.stdout);
		return cmd;
	},
	[npm]: (pkg) => {
		const cmd = execa(npm, [install, pkg], { shell });
		cmd.stdout.pipe(process.stdout);
		return cmd;
	}
};
let pkgManager = isYarn ? yarn : npm;

export default {
	install: () => installCmds[pkgManager](),
	add: (pkg) => addCommands[pkgManager](pkg),
	use: (manager) => {
		if (!packageManagers.includes(manager)) {
			throw new Error(`Unknown package manager ${manager}`);
		}
		pkgManager = manager;
	}
};
