import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import pkgup from 'pkg-up';
import { has, get, merge } from 'lodash';
import fs from 'fs';
import es6Require from '@lmig/bmo-es6-require';
import injectDependencies from '@lmig/bmo-injector';
import defaultDependencies from './dependencies';
import defaultConfig from './defaultConfig';
import loadRoute from './loadRoute';

const paths = (dir) => ({
	dependencies: path.resolve(dir, './dependencies'),
	routes: path.resolve(dir, './routes'),
	middleware: path.resolve(dir, './middleware'),
	views: path.resolve(dir, './views'),
	index: path.resolve(dir, './index.js')
});

export default class HttpServer {
	constructor (config) {
		this._app = new Koa();
		this.config = merge({}, defaultConfig, config);
	}

	get app () {
		return this._app;
	}

	get baseDir () {
		return this.config.baseDir || process.cwd();
	}

	get paths () {
		if (!this._paths) {
			this._paths = paths(this.baseDir);
		}
		return this._paths;
	}

	get port () {
		return this.config.server.port;
	}

	async start () {
		if (this._started) {
			throw new Error(`Cannot start same server twice.`);
		}
		this._started = true;
		const packagePath = await pkgup();
		this._pkg = require(packagePath);
		this.config.pkg = this._pkg;
		await this._injectDependencies();
		this._loadMiddleware();
		this._loadRoutes();
		this._loadStatic();
		await this.app.listen(this.port);
	}

	_getDependencyConstructors () {
		if (fs.existsSync(this.paths.dependencies)) {
			return es6Require(this.paths.dependencies);
		}
		return {};
	}

	_getRouteConstructors () {
		if (fs.existsSync(this.paths.routes)) {
			return es6Require(this.paths.routes);
		}
		return () => [];
	}

	async _injectDependencies () {
		const dependencies = this._getDependencyConstructors();
		const routes = this._getRouteConstructors();

		const allDependencies = merge({}, defaultDependencies, dependencies, { routes });
		allDependencies.middleware = [].concat(defaultDependencies.middleware, dependencies.middleware); ;
		this.manifest = await injectDependencies(this.config, allDependencies);
	}

	_loadRoutes () {
		const routes = get(this, 'manifest.dependencies.routes', []);
		routes.forEach((route) => this._loadRoute(route));
	}

	_loadRoute (route) {
		const router = loadRoute(route,
			this.manifest.dependencies.requestValidator,
			Router);
		this.app.use(router.routes(), router.allowedMethods());
	}

	_loadMiddleware () {
		const { middleware } = this.manifest.dependencies;
		middleware.forEach(mw => {
			if (has(mw, 'use') && !mw.use) {
				return;
			}
			this.app.use(mw);
		});
	}

	_loadStatic () {
		const { serveStatic } = this.manifest.dependencies;
		const staticPaths = get(this, 'config.server.static', []);
		staticPaths.forEach((path) => this.app.use(serveStatic({ path })));
	}
}
