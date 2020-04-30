import execa from 'execa'
import fs from 'fs-extra'
import templates from './templates'
import logger from '../../../../logger'
// TODO
// extendable registries
// extendable eslint options
//
const yarn = 'yarn'
const npm = 'npm'
const install = 'install'
const packageManagers = [ yarn, npm ]
const shell = true
const installCmds = {
  [yarn]: () => {
    const cmd = execa(yarn, [ install ], { shell })
    cmd.stdout.pipe(process.stdout)
    cmd.stderr.pipe(process.stderr)
    return cmd
  },
  [npm]: () => {
    const cmd = execa(npm, [ install ], { shell })
    cmd.stdout.pipe(process.stdout)
    cmd.stderr.pipe(process.stderr)
    return cmd
  }
}
export default async ({ name }) => {
  const baseDir = process.cwd()
  const questions = [{
    name: 'continue',
    when: () => !fs.emptyDirSync(baseDir),
    type: 'confirm',
    message: 'The current directory is not empty. Do you want to continue?'
  },
  {
    name: 'name',
    default: name,
    message: 'project name',
    when: answers => {
      if (!answers.continue) {
        logger.info('Aborting project creation')
        process.exit(0)
      }

      return true
    }
  },
  {
    name: 'description',
    message: 'Project description'
  },
  {
    type: 'list',
    choices: packageManagers,
    name: 'packageManager',
    message: 'Which package manager do you want to use'
  },
  {
    type: 'confirm',
    default: 'yes',
    name: 'eslint',
    message: 'Would you like to run eslint on the project?'
  }]

  return {
    questions,
    preProcess: async ({ files, answers }) => {
      if (answers.eslint) {
        files[`${baseDir}/.eslintrc.js`] = templates.eslint
      }

      return { files, answers }
    },
    files: {
      [`${baseDir}/config/index.js`]: templates.config.index,
      [`${baseDir}/config/routes.js`]: () => templates.config.routes({}),
      [`${baseDir}/package.json`]: templates.pkg,
      [`${baseDir}/dependencies/index.js`]: templates.dependencies.index,
      [`${baseDir}/routes/index.js`]: templates.routes.index,
      [`${baseDir}/.gitignore`]: templates.gitIgnore
    },
    postProcess: async ({ answers: { packageManager, eslint }}) => {
      logger.info('Installing dependencies...')
      await installCmds[packageManager]()
      if (eslint) {
        logger.info('Running eslint...')
        const cmd = execa.command(`${packageManager} run lint:fix`, { shell })
        cmd.stdout.pipe(process.stdout)
        cmd.stderr.pipe(process.stderr)
        await cmd
      }

      logger.info('Project creation successful!')
    }
  }
}
