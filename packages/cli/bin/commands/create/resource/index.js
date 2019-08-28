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

export default async () => ({
	questions: [{
		message: 'What is the path of your resource?',
		name: 'path',
		default: `/api/${name}`
	}, {
		message: 'What version of the resource?',
		default: `v1`,
		name: 'version'
	}],
	preProcess: ({ files, answers }) => {
		const { path, version } = answers;
		each(HANDLER_TEMPLATES, async (template, method) => {
			files[`routes/${name}/${version}/handlers/${method}/index.js`] = () => templates.handler(template(answers));
			files[`routes/${name}/${version}/handlers/${method}/index.test.js`] = templates.test;
		});
		files[`routes/${name}/${version}/handlers/index.js`] = templates.index;
		files[`config/routes.js`] = () => templates.routesConfig({
			[name]: {
				[version]: `${path}/${version}`
			}
		});
		return { files, answers };
	}
});
