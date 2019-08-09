import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import pkgup from 'pkg-up';
import { has } from 'lodash';
import es6Require from '@lmig/bmo-es6-require';
import injectDependencies from './injectDependencies';
import defaultDependencies from './dependencies';
import defaultConfig from './defaultConfig';
import loadRoute from './loadRoute';

const paths = (dir) => ({
	dependencies: path.resolve(dir, './dependencies'),
	routes: path.resolve(dir, './routes'),
	middleware: path.resolve(dir, './middleware'),
	views: path.resolve(dir, './views')
});

export default class HttpServer {
	constructor (config) {
		this._app = new Koa();
		this.config = { ...defaultConfig, ...config };
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
		await this.app.listen(this.port);
	}

	async _injectDependencies () {
		const dependencies = es6Require(this.paths.dependencies);
		const routes = es6Require(this.paths.routes);
		this.manifest = await injectDependencies(this.config, {
			...defaultDependencies,
			...dependencies,
			routes
		});
		console.log(this.manifest);
	}

	_loadRoutes () {
		const { routes } = this.manifest.dependencies;
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
}
