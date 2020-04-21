import App from './app';

export { default as dependencies } from './dependencies';

export default (config) => {
	return new App(config);
};
