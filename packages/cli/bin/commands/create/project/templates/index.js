import * as config from './config';
import * as dependencies from './dependencies';
import pkg from './package';
import * as routes from './routes';
import * as deploy from './deploy';
const yarn = ({ registry }) => `registry "${registry}"`;
const npm = ({ registry }) => `registry="${registry}"`;
const sonar = ({ name }) =>
	`
sonar.projectKey=com.uscm:${name}
sonar.projectName=${name}

sonar.sources=src
sonar.test=test
sonar.language=js

sonar.exclusions=**/__tests__/**, coverage/**, node_modules/**`;

export default {
	config,
	dependencies,
	deploy,
	pkg,
	routes,
	sonar,
	rc: {
		yarn,
		npm
	}
};
