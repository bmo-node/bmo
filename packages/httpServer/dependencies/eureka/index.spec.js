import eureka, { createConfiguration } from '.';
const enabled = true;
const loggerLevel = 'debug';
const manifest = () => ({
	config: {
		eureka: {
			enabled,
			loggerLevel
		}
	},
	dependencies: {
		eurekaClient: {
			start: jest.fn(),
			logger: {
				level: jest.fn()
			}
		},
		dnaClient: {
			setConfiguration: jest.fn()
		}
	}
});
describe('Eureka', () => {
	it('Should set the log level', () => {
		const m = manifest();
		eureka(m);
		expect(m.dependencies.eurekaClient.logger.level).toHaveBeenCalledWith(loggerLevel);
	});
	it('Should call start', () => {
		const m = manifest();
		eureka(m);
		expect(m.dependencies.eurekaClient.start).toHaveBeenCalled();
	});
	it('Should call setConfiguration', () => {
		const m = manifest();
		const client = m.dependencies.eurekaClient;
		eureka(m);
		expect(m.dependencies.dnaClient.setConfiguration).toHaveBeenCalledWith(createConfiguration({ eurekaClient: client }));
	});
	it('Should not call set setConfiguration when enabled is false', () => {
		const m = manifest();
		m.config.eureka.enabled = false;
		eureka(m);
		expect(m.dependencies.dnaClient.setConfiguration).not.toHaveBeenCalled();
	});
});
