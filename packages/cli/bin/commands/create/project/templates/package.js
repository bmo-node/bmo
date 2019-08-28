const base = ({ name, description, serverVersion, cliVersion }) => ({
	'name': name,
	'version': '1.0.0',
	'description': description,
	'main': 'index.js',
	'scripts': {
		'test': "jest --passWithNoTests && echo '\\033[0;31m ***Jest is passing with no tests. You should change that***\\033[0m'",
		'start': 'bmo start',
		'start:dev': 'bmo start -d',
		'lint': 'eslint .',
		'lint:fix': 'eslint --fix .'
	},
	'author': '',
	'license': 'SEE LICENSE.md',
	'dependencies': {
		'@lmig/bmo-cli': `^${cliVersion}`,
		'@lmig/bmo-http-server': `${serverVersion}`,
		'http-methods-enum': '^0.1.1',
		'http-status-codes': '^1.3.2',
		'joi': '^14.3.1',
		'lodash': '^4.17.15',
		'uuid': '^3.3.2'
	},
	'devDependencies': {
		'jest': '^24.8.0'
	},
	'jest': {
		'reporters': [
			'default'
		],
		'collectCoverage': true,
		'collectCoverageFrom': [
			'**/*.js',
			'!**/node_modules/**'
		],
		'projects': [
			'<rootDir>'
		]
	}
});
const scripts = {
	snyk: {
		'snyk:test': 'snyk test --org=liberty-mutual --severity-threshold=medium',
		'snyk:wizard': 'snyk wizard'
	},
	eslint: {
		'lint': 'eslint .',
		'lint:fix': 'eslint --fix .'
	}
};
const dependencies = {
	snyk: {
		'snyk': '^1.167.0'
	},
	eslint: {
		'@lmig/eslint-config-cm': '^1.0.6',
		'eslint': '^6.2.2'
	}
};

export default (info) => {
	const basePkg = base(info);
	if (info.snyk) {
		basePkg.scripts = {
			...basePkg.scripts,
			...scripts.snyk
		};

		basePkg.devDependencies = {
			...basePkg.devDependencies,
			...dependencies.snyk
		};
	}
	if (info.eslint) {
		basePkg.scripts = {
			...basePkg.scripts,
			...scripts.eslint
		};

		basePkg.devDependencies = {
			...basePkg.devDependencies,
			...dependencies.eslint
		};
	}

	return 	JSON.stringify(basePkg, 0, 2);
};
