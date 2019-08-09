import inquirer from 'inquirer';
import fs from 'fs-extra';
import { dependency, test } from './template';
export default async (name) => {
	const answers = await inquirer.prompt([{
		name: 'name',
		default: name,
		message: 'Dependency name'
	},
	{
		default: 'dependencies',
		message: 'Dependency location',
		name: 'location'
	},
	{
		default: true,
		type: 'confirm',
		name: 'test',
		message: 'Create test file?'
	}]);
	await fs.outputFile(`${answers.location}/${answers.name}/index.js`, dependency(name));
	if (answers.test) {
		await fs.outputFile(`${answers.location}/${answers.name}/index.spec.js`, test(name));
	}
};
