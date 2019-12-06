import execa from 'execa'
import templates from './templates'

const yarn = 'yarn'
const npm = 'npm'
const install = 'install'
const packageManagers = [ yarn, npm ]

const shell = true
const installCmds = {
  [yarn]: () => {
    const cmd = execa(yarn, [ install ], { shell })
    cmd.stdout.pipe(process.stdout)
    return cmd
  },
  [npm]: () => {
    const cmd = execa(npm, [ install ], { shell })
    cmd.stdout.pipe(process.stdout)
    return cmd
  }
}
export default async ({ name }) => {
  const baseDir = process.cwd()
  const questions = [{
    name: 'name',
    default: name,
    message: 'project name'
  },
  {
    default: `A project description for ${name}`,
    name: 'description',
    message: 'Project description'
  },
  {
    type: 'list',
    choices: packageManagers,
    name: 'packageManager',
    message: 'Which package manager do you want to use'
  }]

  return {
    questions,
    files: {
      [`${baseDir}/config/index.js`]: templates.config.index,
      [`${baseDir}/config/routes.js`]: () => templates.config.routes({}),
      [`${baseDir}/package.json`]: templates.pkg,
      [`${baseDir}/dependencies/index.js`]: templates.dependencies.index,
      [`${baseDir}/routes/index.js`]: templates.routes.index,
      [`${baseDir}/.gitignore`]: templates.gitIgnore
    },
    postProcess: async ({ answers: { packageManager }}) => {
      await installCmds[packageManager]()
    }
  }
}
