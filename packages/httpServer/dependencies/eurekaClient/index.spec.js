import Eureka from 'eureka-client';
import client, { createConfig } from '.';
jest.mock('eureka-client');
const ip = '1.1.1.1';
const port = 3000;
const hostname = 'www.bmo.com';
const name = 'bmo';
const enabled = true;
const serviceUrl = 'service.bmo.com';
const manifest = () => ({
	config: {
		server: {
			ip,
			port,
			hostname
		},
		pkg: { name },
		eureka: {
			enabled,
			serviceUrl
		}
	}
});
describe('Eureka client', () => {
	it('Should call the constructor with the config value', () => {
		const expectedConfig = createConfig({
			serviceUrl,
			name,
			ip,
			port,
			hostname
		});
		client(manifest());
		expect(Eureka).toHaveBeenCalledWith(expectedConfig);
	});
	it('Should return empty when Eureka is disabled', () => {
		const m = manifest();
		m.config.eureka.enabled = false;
		const result = client(m);
		expect(result).toEqual({});
	});
	it('Should return the same client called multiple times', () => {
		const m = manifest();
		const result = client(m);
		const result2 = client(m);
		expect(result).toBe(result2);
	});
});
