import { appVue, mainComponentVue, packageJson, indexHtml, mainJs } from './templates';
import execa from 'execa';
const pkgs = [
	'vue',
	'vuex',
	'@vue/cli-service',
	'vue-template-compiler',
	'@lmig/shep'
];

const installCmd = (pkg) => {
	const yarn = 'yarn';
	const add = 'add';
	const shell = true;
	const parms = [add, pkg];
	const child = execa(yarn, parms, { shell });
	child.stdout.pipe(process.stdout);
	return child;
};

const vueSkelQuestions = (name) => [{
	name: 'appName',
	default: name,
	description: 'application name',
	message: 'Application name:'
},
{
	name: 'mainComponentName',
	default: 'MainComponent',
	description: 'main component name',
	message: 'Main component name:'
}];

const postGenerateInstall = async () => {
	for (let i = 0; i < pkgs.length; i++) {
		await installCmd(pkgs[i]);
	}
};

export default {
	templates: {
		'vue-skeleton': ({ name }) => ({
			questions: vueSkelQuestions(name),
			files: {
				'src/App.vue': (answers) => appVue(answers.mainComponentName, {}),
				'public/index.html': (answers) => indexHtml(answers.appName),
				'package.json': (answers) => packageJson(answers.appName),
				'src/main.js': () => mainJs()
			},
			preProcess: ({ files, answers }) => {
				files['src/components/' + answers.mainComponentName + '.vue'] =
					() => mainComponentVue(answers.mainComponentName);
				return { files, answers };
			},
			postProcess: postGenerateInstall
		})
	},
	commands: {}
};
