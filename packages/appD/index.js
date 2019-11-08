// eslint-disable-next-line import/no-extraneous-dependencies
import appdynamics from 'appdynamics'; // appdynamics needs to be installed globally when running
export default ({ config: { appDEnabled = false } }) => {
	if (appDEnabled) {
		appdynamics.profile({
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
