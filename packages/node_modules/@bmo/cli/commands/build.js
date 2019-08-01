
// /babel ./packages/node_modules/@randall -d ./dist/packages/node_modules/@randall --copy-files
// get packages
// run custom build if defined in package.json
// run babel on any files not under a folder that has a package.json defined somewhere above it.
//
import { get, has } from 'lodash';
import Listr from 'listr';
import execa from 'execa';
import fse from 'fs-extra';
import { basename } from 'path';
import {
	getTopLevelPackages,
	loadPackage,
	getTopLevelDirectories
} from '../common';

const CWD = process.cwd();
const PACKAGE_PATH = 'packages/node_modules';
const SEARCH_BUILD_FOLDERS = ['build', 'dist'];
const DESTINATION_DIRECTORY = `${CWD}/dist`;
const buildOutputError = pkg => `${pkg.name} at ${pkg.directory} does not contain any ${SEARCH_BUILD_FOLDERS.join(', ')} folder. Please put build output into one of those locations or define a build.output.folder key in your package.json`;
const getCustomOutputDir = pkg => async (ctx) => {
	// copy build files
	if (has(pkg, 'build.output.folder')) {
		ctx.customBuildOutput = pkg.build.output.folder;
	} else {
		ctx.customBuildOutput = (await Promise.all(SEARCH_BUILD_FOLDERS.map(async (buildPath) => {
			const path = `${pkg.directory}/${buildPath}`;
			const exists = await fse.pathExists(path);
			return exists ? buildPath : null;
		}))).find(path => path);
	}
	if (!ctx.customBuildOutput) {
		throw new Error(buildOutputError(pkg));
	}
	ctx.relativePath = pkg.directory.replace(CWD, '');
	ctx.baseOutputDir = `${DESTINATION_DIRECTORY}${ctx.relativePath}`;
};

const buildModule = modulePath => ctx => execa('npx babel', [`${modulePath}/`, '-d', `./dist/${modulePath}`, '--copy-files'], { cwd: CWD, spawn: true });

const tasks = new Listr([
	{
		title: 'Pre Process',
		task: () => new Listr([
			{
				title: 'Cleaning workspace',
				task: async ctx => fse.emptyDir(DESTINATION_DIRECTORY)
			},
			{
				title: 'Getting custom packages',
				task: (ctx) => {
					ctx.customPackagePaths = getTopLevelPackages(PACKAGE_PATH);
				}
			},
			{
				title: 'Loading packages',
				task: (ctx) => {
					ctx.customPackages = ctx.customPackagePaths.map(loadPackage);
				}
			},
			{
				title: 'Getting custom build packages',
				task: (ctx) => {
					ctx.customBuilds = ctx.customPackages.filter(pkg => has(pkg, 'scripts.build')) || [];
					ctx.customBuildPaths = ctx.customBuilds.map(pkg => pkg.directory);
				}
			}
		])
	},
	{
		title: 'Build Custom Packages',
		skip: ctx => ctx.customBuilds.length === 0,
		task: () => new Listr([
			{
				title: 'Build',
				task: ctx => new Listr(ctx.customBuilds.map(pkg => ({
					title: `Building ${pkg.name} at ${pkg.directory}`,
					// TODO make it npm/yarn compatible
					task: () => execa('yarn', ['run', 'build'], { cwd: pkg.directory, spawn: true })
				})), { concurrent: true })
			},
			{
				title: 'Copy Files',
				task: ctx => new Listr(ctx.customBuilds.map(pkg => ({
					title: `Copying built files for ${pkg.name}`,
					task: () => new Listr([{
						title: 'Get custom output dir',
						task: getCustomOutputDir(pkg)
					}, {
						title: 'Copy build files',
						task: async (ctx) => {
							const { customBuildOutput, baseOutputDir } = ctx;
							// Copy package files
							await fse.copy(`${pkg.directory}/${customBuildOutput}`, `${baseOutputDir}/${customBuildOutput}`);
						}
					}, {
						title: 'Copy package files`',
						task: async (ctx) => {
							const { baseOutputDir } = ctx;

							const { main } = pkg;
							const otherFiles = [pkg.location, ...get(pkg, 'files', []).map(file => `${pkg.directory}${file}`)];
							if (main) {
								otherFiles.push(`${pkg.directory}/${main}`);
							}
							await Promise.all(otherFiles.map(file => fse.copy(`${file}`, `${baseOutputDir}/${basename(file)}`)));
						}
					}])
				})))
			}
		], { concurrent: false })
	},
	{
		title: 'Compiling JS',
		task: () => new Listr([
			{
				title: 'Gathering directories',
				task: ctx => (ctx.topLevelDirectories = getTopLevelDirectories(PACKAGE_PATH))
			},
			{
				title: 'Filtering custom builds',
				task: (ctx) => {
					ctx.buildFolders = ctx.topLevelDirectories.filter(dir => !ctx.customBuildPaths.find(path => path.includes(dir)));
				}
			},
			{
				title: 'Transpiling',
				task: ctx => new Listr(ctx.buildFolders.map(modulePath => ({
					title: 'Building module ',
					task: buildModule(modulePath)
				})))
			}
		])
	}
], { concurrent: false });

tasks
	.run()
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
