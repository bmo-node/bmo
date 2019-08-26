/* eslint-disable no-useless-escape */
import jenkinsFile from './jenkinsFile';
export const dockerFile = () =>
	`FROM dtr-uscm.ddc2.prod-shared.aws.lmig.com/jenkinsuser/oracle-node-dockerfile:latest

WORKDIR /usr/src/app

# Add app
COPY node_modules /usr/src/app/node_modules
COPY dist /usr/src/app/dist
COPY config /usr/src/app/config
COPY swagger /usr/src/app/swagger
COPY package.json /usr/src/app/package.json

HEALTHCHECK --interval=60s --timeout=30s --retries=3 CMD curl -v --fail http://localhost:8080/health || exit 1

EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]`;

export default {
	dockerFile,
	jenkinsFile
};
