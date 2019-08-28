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
	}
};
