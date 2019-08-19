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
const deploymentTemplates = {
	fusion: async (projectInfo) => {
		const { baseDir } = projectInfo;
		await fs.outputFile(`${baseDir}/Jenkinsfile`, templates.deploy.jenkinsFile(projectInfo));
		await fs.outputFile(`${baseDir}/Dockerfile`, templates.deploy.dockerFile(projectInfo));
		await fs.outputFile(`${baseDir}/docker-compose/docker-compose.yml`, templates.deploy.dockerCompose(projectInfo));
	}
};
const deploymentTypes = Object.keys(deploymentTemplates);
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
	}, {
		type: 'confirm',
		default: 'yes',
		name: 'deployment',
		message: 'Would you like a deployment boilerplate?'
	}, {
		type: 'list',
		choices: deploymentTypes,
		name: 'deploymentType'
	}, {
		type: 'confirm',
		default: 'yes',
		name: 'sonar',
		message: 'Would you like to run sonar on the project?'
	}, {
		type: 'confirm',
		default: 'yes',
		name: 'snyk',
		message: 'Would you like to run snyk on the project?'
	}]);
	return answers;
};

const writeFiles = async (projectInfo) => {
	const baseDir = process.cwd();
	projectInfo.baseDir = baseDir;
	projectInfo.gitRepo = 'git.repo';
	await fs.outputFile(`${baseDir}/config/index.js`, templates.config.index(projectInfo));
	await fs.outputFile(`${baseDir}/config/routes.js`, templates.config.routes({}));
	await fs.outputFile(`${baseDir}/package.json`, templates.pkg(projectInfo));
	await fs.outputFile(`${baseDir}/dependencies/index.js`, templates.dependencies.index(projectInfo));
	await fs.outputFile(`${baseDir}/routes/index.js`, templates.routes.index(projectInfo));
	if (projectInfo.registry !== defaultRegistry) {
		await fs.outputFile(`${baseDir}/.${projectInfo.packageManager}rc`, templates.rc[projectInfo.packageManager](projectInfo));
	}
	if (projectInfo.deployment) {
		await deploymentTemplates[projectInfo.deploymentType](projectInfo);
	}
	if (projectInfo.sonar) {
		await fs.outputFile(`${baseDir}/sonar-project.properties`, templates.sonar(projectInfo));
	}
};
const addSnky = () => {

};
export default async ({ name }) => {
	const pkgPath = await pkgup({ cwd: __dirname });
	console.log(pkgPath);
	const pkg = require(pkgPath);
	const serverVersion = pkg.peerDependencies[BMO_HTTP];
	const cliVersion = pkg.version;
	const info = await getProjectInfo(name);
	await writeFiles({
		...info,
		serverVersion,
		cliVersion
	});
	await installCmds[info.packageManager]();
};
