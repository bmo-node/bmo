import httpServer from '@lmig/bmo-http-server';
import { set } from 'lodash';
export default async ({ config, args, cwd }) => {
	const userConfig = await config();
	userConfig.baseDir = args.baseDir || cwd;
	userConfig.server = userConfig.server || {};
	set(userConfig, 'server.static', args.serve || []);
	const server = httpServer(userConfig);
	await server.start();
	console.log(server);
	console.log(`Server listening on ${server.port}`);
};
