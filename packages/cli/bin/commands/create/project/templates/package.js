export default ({ name, description, serverVersion, cliVersion }) => JSON.stringify({
	'name': name,
	'version': '1.0.0',
	'description': description,
	'main': 'index.js',
	'scripts': {
		'test': 'echo "Error: no test specified" && exit 1',
		'start': 'bmo start',
		'start:dev': 'bmo start -d'
	},
	'author': '',
	'license': 'ISC',
	'dependencies': {
		'@lmig/bmo-cli': `^${cliVersion}`,
		'@lmig/bmo-http-server': `^${serverVersion}`,
		'http-methods-enum': '^0.1.1',
		'http-status-codes': '^1.3.2',
		'joi': '^14.3.1',
		'lodash': '^4.17.15',
		'uuid': '^3.3.2'
	}
}, 0, 2);
