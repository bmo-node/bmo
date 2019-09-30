import program from 'commander';
import injector from '@lmig/bmo-injector';
import { isFunction, transform, map } from 'lodash';
import logger from '../logger';
import packageman from '../packageman';
const logDep = () => logger;

const generateCommandModules = (commands) => transform(commands, (agg, cmd, key) => {
	if (isFunction(cmd)) {
		agg[key] = cmd;
	} else {
		agg[key] = () => cmd;
	}
	return agg;
}, {});

const runAll = async (tasks) => Promise.all(tasks.map(async (f) => await f()));

export default async ({ program, extensions }) => {
	const { commands } = extensions;
	const commandModules = generateCommandModules(commands);
	const manifest = await injector({}, {
		logger: logDep,
		commands: commandModules,
		extensions: () => extensions
	});
	const cmdLoaders = map(manifest.dependencies.commands, (cmd, key) => async () => {
		logger.info(`Loading command ${key}`);
		const executableFile = cmd.file;
		if (executableFile) {
			program.command(cmd.format, cmd.description, { executableFile });
		} else {
			if (!cmd.action) {
				throw new Error(`command ${key} must define either action or file`);
			}
			const actionManifest = await injector({}, {
				logger: logDep,
				action: cmd.action
			});
			program
				.command(cmd.format)
				.description(cmd.description)
				.action(actionManifest.dependencies.action);
		}
	});
	await runAll(cmdLoaders);
};
