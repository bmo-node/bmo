import pkgup from 'pkg-up';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import execa from 'execa';
import templates from './templates';
const BMO_HTTP = '@lmig/bmo-http-server';
const defaultRegistry = 'default';
const registries = [
	'https://pi-artifactory.lmig.com/artifactory/api/npm/npm',
	defaultRegistry
];
const yarn = 'yarn';
const npm = 'npm';
const install = 'install';
const packageManagers = [yarn, npm];
const shell = true;
const installCmds = {
	[yarn]: () => execa(yarn, [install], { shell }).stdout.pipe(process.stdout),
	[npm]: () => execa(npm, [install], { shell }).stdout.pipe(process.stdout)
};
const getProjectInfo = async (name) => {
	const answers = await inquirer.prompt([{
		name: 'name',
		default: name,
		message: 'project name'
	},
	{
		default: `A project description for ${name}`,
		name: 'description',
		message: 'Create test file?'
	},
	{
		type: 'list',
		choices: packageManagers,
		name: 'packageManager',
		message: 'Which package manager do you want to use'
	}, {
		type: 'list',
		choices: registries,
		default: registries[0],
		name: 'registry',
		message: 'Which registry should be used?'
	}]);
	return answers;
};
const writeFiles = async (projectInfo) => {
	const baseDir = process.cwd();
	await fs.outputFile(`${baseDir}/config/index.js`, templates.config.index(projectInfo));
	await fs.outputFile(`${baseDir}/package.json`, templates.pkg(projectInfo));
	await fs.outputFile(`${baseDir}/dependencies/index.js`, templates.dependencies.index(projectInfo));
	await fs.outputFile(`${baseDir}/routes/index.js`, templates.routes.index(projectInfo));
	await fs.outputFile(`${baseDir}/routes/health/index.js`, templates.routes.health(projectInfo));
	if (projectInfo.registry !== defaultRegistry) {
		await fs.outputFile(`${baseDir}/.${projectInfo.packageManager}rc`, templates.rc[projectInfo.packageManager](projectInfo));
	}
};
export default async ({ name }) => {
	const pkgPath = await pkgup({ cwd: __dirname });
	console.log(pkgPath);
	const pkg = require(pkgPath);
	const serverVersion = pkg.dependencies[BMO_HTTP];
	const cliVersion = pkg.version;
	const info = await getProjectInfo(name);
	await writeFiles({
		...info,
		serverVersion,
		cliVersion
	});
	await installCmds[info.packageManager]();
};
