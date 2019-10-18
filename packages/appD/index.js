const host = process.env.APPDYNAMICS_CONTROLLER_HOST_NAME;
const accountName = process.env.APPDYNAMICS_AGENT_ACCOUNT_NAME;
const accountAccessKey = process.env.APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY;

// appdynamics gets installed as part of the docker image build
// eslint-disable-next-line import/no-extraneous-dependencies

export default async () => () => require('appdynamics').profile({
	controllerHostName: host,
	controllerPort: 443,
	controllerSslEnabled: true,
	accountName,
	accountAccessKey,
	applicationName: `GRMUS_${process.env.APP_NAME}_${process.env.APP_ENV}`,
	tierName: `${process.env.APP_NAME}`,
	nodeName: `${process.env.APP_NAME}`,
	reuseNode: true,
	reuseNodePrefix: `${process.env.APP_NAME}`
});
