import { load } from '.';

const DEFAULT_TEST_CONFIG = `${__dirname}/test/defaultOnly`;
const ENVIRONMENT_CONFIG = `${__dirname}/test/withEnvironment`;
const NON_EXISTENT_CONFIG = `${__dirname}/test/foo`;
describe('BMO config', () => {
	describe('Loading config', () => {
		it('Should load an empty object if there is no config found at the given path', async () => {
			const cfg = await load(NON_EXISTENT_CONFIG);
			expect(cfg).toMatchObject({
				get: expect.any(Function),
				has: expect.any(Function)
			});
		});

		it('Should load the default config', async () => {
			const cfg = await load(DEFAULT_TEST_CONFIG);
			expect(cfg).toMatchObject({
				foo: 'bar',
				get: expect.any(Function),
				has: expect.any(Function)
			});
		});

		it('Should load the default config', async () => {
			const currentEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = 'test';
			const cfg = await load(ENVIRONMENT_CONFIG);
			expect(cfg).toMatchObject({
				foo: 'bar',
				baz: 'buz',
				get: expect.any(Function),
				has: expect.any(Function)
			});

			process.env.NODE_ENV = currentEnv;
		});
	});

	describe('Getting Values', () => {
		it('Should return the value of the key', async () => {
			const cfg = await load(DEFAULT_TEST_CONFIG);
			expect(cfg.get('foo')).toEqual('bar');
		});
		it('Should return undefined if the key does not exist', async () => {
			const cfg = await load(DEFAULT_TEST_CONFIG);
			expect(cfg.get('baz')).toEqual(undefined);
		});
	});

	describe('Checking for keys', () => {
		it('Should return true if the key exists', async () => {
			const cfg = await load(DEFAULT_TEST_CONFIG);
			expect(cfg.has('foo')).toBeTruthy();
		});

		it('Should return false if the key  does not exist', async () => {
			const cfg = await load(DEFAULT_TEST_CONFIG);
			expect(cfg.has('baz')).toBeFalsy();
		});
	});
});
