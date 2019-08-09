import es6Require from '.';

import testExport from './test/test.export';
import testModule from './test/test.module';
import testModuleDefault from './test/test.module';

describe('es6 require', () => {
	it('Should import the default if defined', () => {
		const mod = es6Require('./test/test.export');
		expect(mod).toBe(testExport);
	});
	it('Should import the module.exports if default is not defined', () => {
		const mod = es6Require('./test/test.module');
		expect(mod).toBe(testModule);
	});

	it('Should import the module.exports if default is defined but it is not an esModule', () => {
		const mod = es6Require('./test/test.module.default');
		expect(mod).toEqual({ default: {} });
	});
});
