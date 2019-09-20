import inject from './inject';
const isObject = (o) => { return (o instanceof Object && !(o instanceof Array)); };

export default class {
	config (config) {
		this._config = config;
		return this;
	}

	dependencies (dependencies) {
		this._dependencies = dependencies;
		return this;
	}

	expose (values) {
		let keys;
		if (isObject(values)) {
			keys = Object.keys(values);
		} else if (Array.isArray(values)) {
			keys = values;
		} else if (!values) {
			this._keys = [];
		}
		this._keys = keys;
		return this;
	}

	async build () {
		this._manifest = await inject(this._config, this._dependencies);
		return this;
	}

	module () {
		const keys = this._keys || Object.keys(this._manifest);
		const exposed = {};
		keys.forEach((key) => {
			if (!this._manifest.dependencies[key]) {
				throw new Error(`Unknown key ${key}`);
			}
			exposed[key] = this._manifest.dependencies[key];
		});
		return exposed;
	}
}
