import deployTemplates from './templates/deploy';
export default {
	templates: {
		fusionDeploy: () => ({
			questions: [],
			files: {
				Dockerfile: deployTemplates.dockerFile,
				Jenkinsfile: deployTemplates.jenkinsFile
			}
		})
	},
	commands: {
		echo: {
			format: `echo <message>`,
			action: (message, commander) => { console.log(message); },
			description: 'Echo to terminal'
		},
		echoFile: {
			format: `echoFile`,
			file: `${__dirname}/echoFile.js`,
			description: 'Echo to terminal'
		}
	}
};
