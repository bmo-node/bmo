import App from './app';
import Router from 'koa-router';
import pkgup from 'pkg-up';
import es6Require from '@lmig/bmo-es6-require';
import injectDependencies from './injectDependencies';
import loadRoute from './loadRoute';
import Koa from 'koa';
import defaultDependencies from './dependencies';
import defaultConfig from './defaultConfig';

const testConfig = { thing: 'thing' };
jest.mock('./injectDependencies');
jest.mock('./loadRoute');
jest.mock('@lmig/bmo-es6-require');
jest.mock('koa');
const requestValidator = jest.fn();
const routes = [{}, {}];
const middleware = [() => {}];
const mockManifest = {
	config: {},
	dependencies: {
		middleware,
		routes,
		requestValidator
	}
};

describe('App', () => {
	afterEach(() => jest.resetAllMocks());
	beforeEach(() => {
		injectDependencies.mockResolvedValue(mockManifest);
		loadRoute.mockImplementation(() => new Router());
	});
	it('Should set the config', () => {
		const app = new App(testConfig);
		expect(app.config).toMatchObject(testConfig);
	});
	it('Should attach the package to config', async () => {
		const app = new App(testConfig);
		await app.start();
		expect(app.config).toHaveProperty('pkg');
	});
	it('Should call load route for each route', async () => {
		const app = new App(testConfig);
		await app.start();
		expect(loadRoute).toHaveBeenCalledTimes(routes.length);
		expect(loadRoute).toHaveBeenLastCalledWith(routes[routes.length - 1], requestValidator, Router);
	});
	it('Should call app.use for each middleware', async () => {
		const app = new App(testConfig);
		app.app.use = jest.fn();
		await app.start();
		expect(app.app.use.mock.calls[0]).toEqual(expect.arrayContaining(middleware));
	});
	it('Should skip app.use when middleware is not usable', async () => {
		const app = new App(testConfig);
		app.app.use = jest.fn();
		const newManifest = { ...mockManifest };
		injectDependencies.mockResolvedValue(newManifest);
		const notUsable = () => {};
		notUsable.use = false;
		newManifest.dependencies.middleware = [notUsable, ...newManifest.dependencies.middleware];
		await app.start();
		expect(app.app.use.mock.calls[0]).not.toEqual(expect.arrayContaining([notUsable]));
	});
	it('Throw an error when start is called more than once', async () => {
		const app = new App(testConfig);
		await app.start();
		try {
			await app.start();
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
		}
	});
});
