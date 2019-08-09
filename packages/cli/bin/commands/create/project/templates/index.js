import * as config from './config';
import * as dependencies from './dependencies';
import pkg from './package';
import * as routes from './routes';
const yarn = ({ registry }) => `registry "${registry}"`;
const npm = ({ registry }) => `registry="${registry}"`;
export default {
	config,
	dependencies,
	pkg,
	routes,
	rc: {
		yarn,
		npm
	}
};
