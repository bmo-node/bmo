import execa from 'execa';
import es6Require from '@lmig/bmo-es6-require';
import { transform } from 'lodash';
import fs from 'fs-extra';
const globalPath = {
	yarn: 'yarn global dir',
	npm: 'npm config get prefix'
};
export default async () => {
	try {
		const isYarn = await fs.exists('yarn.lock');
		const pkgManager = isYarn ? 'yarn' : 'npm';
		const globalLocation = await execa.command(globalPath[pkgManager], { shell: true }).stdout;

		const { stdout } = await execa.command(`${pkgManager} -g ls --depth=0 --json || true`, { shell: true });
		const { dependencies } = JSON.parse(stdout);
		return transform(dependencies, (accumulator, value, key) => {
			console.log(key);
			if (key.match(/bmo-extension/gim)) {
				console.log(require.resolve.paths(key));
				const location = require.resolve(key, globalLocation);
				console.log(location);
				//			accumulator[key] = es6Require(location);
			}
			return accumulator;
		}, {});
	} catch (e) {
		console.log('There was an error getting your dependencies');
		console.error(e);
	}
};
