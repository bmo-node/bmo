
import execa from 'execa';
import path from 'path';
import { getTopLevelPackages } from './common';

const buildPackages = async (packages) => {
	console.log(`Building ${packages.join(', ')}`);
	await Promise.all(packages.map(async (pkgPath) => {
		console.log(`Installing custom modules at ${path.dirname(pkgPath)}`);
		try {
			const result = await execa('yarn', ['--ignore-optional', '--ignore-engines'], { cwd: `${path.dirname(pkgPath)}` });
			console.log(result);
		} catch (e) {
			console.error(`Failed to install ${pkgPath}`);
			console.error(e);
			process.exit(1);
		}
	}));
};

buildPackages(getTopLevelPackages('packages/node_modules'));
