// eslint-disable-next-line import/no-extraneous-dependencies
export default ({ config: { appDEnabled = false } }) => {
	if (appDEnabled) {
		require('appdynamics').profile({
			controllerHostName: process.env.APPDYNAMICS_CONTROLLER_HOST_NAME,
			controllerPort: 443,
			controllerSslEnabled: true,
			accountName: process.env.APPDYNAMICS_AGENT_ACCOUNT_NAME,
			accountAccessKey: process.env.APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY,
			applicationName: `${process.env.APP_NAME}_${process.env.NODE_ENV}`,
			tierName: `${process.env.APP_NAME}`,
			nodeName: `${process.env.APP_NAME}`,
			reuseNode: true,
			reuseNodePrefix: `${process.env.APP_NAME}`
		});
	};
};
