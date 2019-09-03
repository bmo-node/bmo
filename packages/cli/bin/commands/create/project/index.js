import execa from 'execa';
import templates from './templates';
// TODO
// extendable registries
// extendable eslint options
//
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
export default async ({ name }) => {
	const baseDir = process.cwd();
	const questions = [{
		name: 'name',
		default: name,
		message: 'project name'
	},
	{
		default: `A project description for ${name}`,
		name: 'description',
		message: 'Project description'
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
		name: 'sonar',
		message: 'Would you like to run sonar on the project?'
	}, {
		type: 'confirm',
		default: 'yes',
		name: 'snyk',
		message: 'Would you like to run snyk on the project?'
	}, {
		type: 'confirm',
		default: 'yes',
		name: 'eslint',
		message: 'Would you like to run eslint on the project?'
	}];

	return {
		questions,
		preProcess: async ({ files, answers }) => {
			if (answers.registry !== defaultRegistry) {
				files[`${baseDir}/.${answers.packageManager}rc`] = templates.rc[answers.packageManager];
			}
			if (answers.sonar) {
				files[`${baseDir}/sonar-project.properties`] = templates.sonar;
			}
			if (answers.eslint) {
				files[`${baseDir}/.eslintrc.js`] = templates.eslint;
			}
			return { files, answers };
		},
		files: {
			[`${baseDir}/config/index.js`]: templates.config.index,
			[`${baseDir}/config/routes.js`]: () => templates.config.routes({}),
			[`${baseDir}/package.json`]: templates.pkg,
			[`${baseDir}/dependencies/index.js`]: templates.dependencies.index,
			[`${baseDir}/routes/index.js`]: templates.routes.index,
			[`${baseDir}/.gitignore`]: templates.gitIgnore
		},
		postProcess: async ({ files, answers: { packageManager, eslint } }) => {
			await installCmds[packageManager]();
			if (eslint) {
				const cmd = execa.command(`${packageManager} lint:fix`);
				cmd.stdout.pipe(process.stdout);
				cmd.stderr.pipe(process.stderr);
				await cmd;
			}
		}
	};
};
