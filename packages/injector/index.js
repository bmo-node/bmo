import inject from './inject';
import extractDependencies from './loadDependency/extractDependencies';
import context from './context';

export default inject;
const extract = (fn) => extractDependencies(fn, 'dependencies');
export {
	extract,
	context
};
