import chalk from 'chalk';

export default () => {
	return {
		info: (msg) => {
			console.log(chalk.blue(msg));
		},
		warn: (msg) => {
			console.log(chalk.yellow(msg));
		},
		error: (msg) => {
			console.log(chalk.red(msg));
		}
	};
};
