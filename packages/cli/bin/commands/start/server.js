import httpServer from '@lmig/bmo-http-server';

export default async ({ config, args, cwd }) => {
	const userConfig = await config();
	userConfig.baseDir = args.baseDir || cwd;
	const server = httpServer(userConfig);
	await server.start();
	console.log(`Server listening on ${userConfig.server.port}`);
};
