import extractDependencies from './extractDependencies';
/* eslint-disable no-unused-vars */
const dependenciesKey = 'dependencies';

describe('extractDependencies', () => {
	describe('Arrow functions', () => {
		// it('Should extract the dependencies from the arrow function', async () => {
		// 	const fooDependency = () => ({});
		// 	const otherDependency = ({ dependencies: { submodule: { fooDependency } } }) => fooDependency;
		// 	const dependencies = await extractDependencies(otherDependency, dependenciesKey);
		// 	expect(dependencies).toEqual(['submodule.fooDependency']);
		// });

		// it('Should extract the dependencies from the submodule', async () => {
		// 	const fooDependency = () => ({});
		// 	const otherDependency = ({ dependencies: { submodule: { fooDependency } } }) => fooDependency;
		// 	const dependencies = await extractDependencies(otherDependency, dependenciesKey);
		// 	expect(dependencies).toEqual(['submodule.fooDependency']);
		// });

		// it('Should extract the dependencies from the sub-submodule', async () => {
		// 	const fooDependency = () => ({});
		// 	const otherDependency = ({ dependencies: { submodule: { subsub: { fooDependency } } } }) => fooDependency;
		// 	const dependencies = await extractDependencies(otherDependency, dependenciesKey);
		// 	expect(dependencies).toEqual(['submodule.subsub.fooDependency']);
		// });

		// it('Should extract the dependencies from the array submodule', async () => {
		// 	const fooDependency = () => ({});
		// 	const otherDependency = ({ dependencies: { submodules: { 1: { fooDependency } } } }) => fooDependency;
		// 	const dependencies = await extractDependencies(otherDependency, dependenciesKey);
		// 	expect(dependencies).toEqual(['submodules.1.fooDependency']);
		// });

		// it('Should allow a reference to itself', async () => {
		// 	const fooDependency = () => ({});
		// 	const otherDependency = (manifest) => {
		// 		const otherDep = manifest.otherDependency = {};
		// 		return otherDep;
		// 	};
		// 	const dependencies = await extractDependencies(otherDependency, dependenciesKey);
		// 	expect(dependencies).toEqual([]);
		// });

		// it('Should support no dependencies', async () => {
		// 	const dep = () => {};
		// 	const dependencies = await extractDependencies(dep, dependenciesKey);
		// 	expect(dependencies).toEqual([]);
		// });

		// it('Should allow no reference', async () => {
		// 	const fooDependency = () => ({});
		// 	const otherDependency = ({ dependencies }) => {};
		// 	const dependencies = await extractDependencies(otherDependency, dependenciesKey);
		// 	expect(dependencies).toEqual([]);
		// });

		it('Should allow for default values', async () => {
			const fooDependency = () => ({});
			const otherDependency = ({ dependencies: { submodule = fooDependency } }) => fooDependency;
			const dependencies = await extractDependencies(otherDependency, dependenciesKey);
			expect(dependencies[0].hasDefaultValue).toBeTruthy();
		});
	});

	// describe('Classic functions', () => {
	// 	it('Should extract the dependencies from the function', async () => {
	// 		const dep = function (manifest) {
	// 			const thing = manifest.dependencies.foo;
	// 		};
	// 		const dependencies = await extractDependencies(dep, dependenciesKey);
	// 		expect(dependencies).toEqual(['foo']);
	// 	});

	// 	it('Should support anonymous functions', async () => {
	// 		const dep = function (manifest) {
	// 			const thing = manifest.dependencies.foo;
	// 		};
	// 		const dependencies = await extractDependencies(dep, dependenciesKey);
	// 		expect(dependencies).toEqual(['foo']);
	// 	});

	// 	it('Should support named functions', async () => {
	// 		const dep = function myFn (manifest) {
	// 			const thing = manifest.dependencies.foo;
	// 		};
	// 		const dependencies = await extractDependencies(dep, dependenciesKey);
	// 		expect(dependencies).toEqual(['foo']);
	// 	});

	// 	it('Should support no dependencies', async () => {
	// 		const dep = function () {};
	// 		const dependencies = await extractDependencies(dep, dependenciesKey);
	// 		expect(dependencies).toEqual([]);
	// 	});

	// 	it('Should allow a reference to itself', async () => {
	// 		const fooDependency = () => ({});
	// 		const otherDependency = function (manifest) {
	// 			const otherDep = manifest.otherDependency = {};
	// 			return otherDep;
	// 		};
	// 		const dependencies = await extractDependencies(otherDependency, dependenciesKey);
	// 		expect(dependencies).toEqual([]);
	// 	});
	// 	it('Should allow no reference', async () => {
	// 		const fooDependency = () => ({});
	// 		const otherDependency = function ({ dependencies }) {};
	// 		const dependencies = await extractDependencies(otherDependency, dependenciesKey);
	// 		expect(dependencies).toEqual([]);
	// 	});
	// });

	// describe('Error cases', () => {
	// 	it('Should throw an error when the dependencies cannot be extracted', () => {
	// 		const dep = '';
	// 		expect(() => extractDependencies(dep, dependenciesKey)).toThrow(Error);
	// 	});
	// });
});
