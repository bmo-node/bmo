import globby from 'globby';
import path from 'path';
/**
 * Get any packages that are NOT in a node_modules folder
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
export const getTopLevelPackages = (dir) => {
	const packages = globby.sync(`${dir}/*/**/package.json`);
	return packages.filter(pkg => !/node_modules/gi.test(pkg.replace(dir, '')));
};

function unique (value, index, self) {
	return self.indexOf(value) === index;
}
/**
 * Get any directories that are under packages/node_modules
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
export const getTopLevelDirectories = (dir) => {
	const directories = globby.sync(`${dir}/*/*/*`, { expandDirectories: false, onlyFiles: false });
	return directories
		.filter(pkg => !/node_modules/gi.test(pkg.replace(dir, '')))
		.map(dirname)
		.filter(unique);
};

/**
 * Load a package.json relative to the process cwd, and append the file path for the package
 * @param  {[type]} name package name
 * @return {[type]}      [description]
 */
export const loadPackage = (name) => {
	const location = `${process.cwd()}/${name}`;
	const def = require(location);
	def.location = location;
	def.directory = dirname(location);
	return def;
};

export const dirname = pathName => path.dirname(pathName);
