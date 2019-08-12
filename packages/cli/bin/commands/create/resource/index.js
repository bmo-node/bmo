import inquirer from 'inquirer';
import fs from 'fs-extra';
import { each } from 'lodash';
import httpMethods from 'http-methods-enum';
import templates from './templates';
const { GET, POST, PUT } = httpMethods;
const HANDLER_TEMPLATES = {
	list: ({ path, version, name }) => ({
		method: GET,
		path: `${path}/${version}`,
		name,
		version
	}),
	get: ({ path, version, name }) => ({
		method: GET,
		path: `${path}/${version}/:id`,
		name,
		version
	}),
	put: ({ path, version, name }) => ({
		method: PUT,
		path: `${path}/${version}/:id`,
		name,
		version
	}),
	post: ({ path, version, name }) => ({
		method: POST,
		path: `${path}/${version}`,
		name,
		version
	})
};
const getResourceInfo = async (name) => {
	const answers = await inquirer.prompt([{
		message: 'What is the path of your resource?',
		name: 'path',
		default: `/api/${name}`
	}, {
		message: 'What version of the resource?',
		default: `v1`,
		name: 'version'
	}]);
	return answers;
};
export default async (name) => {
	const info = await getResourceInfo(name);
	const handlers = Object.keys(HANDLER_TEMPLATES);
	each(HANDLER_TEMPLATES, async (template, method) => {
		const handlerSrc = templates.handler(template({ name, ...info }));
		await fs.outputFile(`routes/${name}/${info.version}/handlers/${method}/index.js`, handlerSrc);
		await fs.outputFile(`routes/${name}/${info.version}/handlers/${method}/index.test.js`, templates.test(name));
	});
	const newRoute = {
		[name]: {
			[info.version]: `${info.path}/${info.version}`
		}
	};
	await fs.outputFile(`routes/${name}/${info.version}/handlers/index.js`, templates.index(handlers));
	await fs.outputFile(`config/routes.js`, templates.routesConfig(newRoute));
};
