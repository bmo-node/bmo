import pkgup from 'pkg-up'
import inquirer from 'inquirer'
import execa from 'execa'
import fs from 'fs-extra'
import { map } from 'lodash'
const BMO_HTTP = '@b-mo/http-server'
const FALLBACK_VERSION = '^0.5.0'

export default ({
  dependencies: {
    logger
  }
}) => async template => {
  const baseDir = process.cwd()
  const pkgPath = await pkgup({ cwd: __dirname })
  const pkg = require(pkgPath)
  let serverVersion
  try {
    serverVersion = (await execa.command(`npm show ${BMO_HTTP} version`)).stdout
  } catch (err) {
    logger.info(`Failed to get latest server version use fallback ${FALLBACK_VERSION}`, err)
    serverVersion = FALLBACK_VERSION
  }

  const cliVersion = pkg.version
  const answers = await inquirer.prompt(template.questions)
  answers.serverVersion = serverVersion
  answers.cliVersion = cliVersion
  answers.baseDir = baseDir
  answers.bmoPkg = pkg
  const files = template.files || {}
  let processed = { files, answers }
  if (template.preProcess) {
    processed = await template.preProcess({ files, answers })
  }

  await Promise.all(map(processed.files, (t, name) => {
    logger.info(`Writing file ${name}`)
    return fs.outputFile(name, t(processed.answers))
  }))
  if (template.postProcess) {
    await template.postProcess({ files, answers })
  }
}
