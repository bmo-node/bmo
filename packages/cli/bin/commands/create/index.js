#!/usr/bin/env node
import commander from 'commander'
import inquirer from 'inquirer'
import dependency from './dependency'
import project from './project'
import resource from './resource'
import extensions from '../../../extensions'
import { map } from 'lodash'
import execa from 'execa'
import fs from 'fs-extra'
import pkgup from 'pkg-up'
import logger from '../../../logger'

const BMO_HTTP = '@b-mo/http-server'
const FALLBACK_VERSION = '^0.5.0'
let template
let name

logger.warn('bmo create will be deprecated in a future version of this package, you will instead have to install: @b-mo/extension-generator and use that for template generation')

commander
  .arguments('<template> [name]', 'creates a BMO http application')
  .action((t, n) => {
    template = t
    name = n
  })

commander.parse(process.argv)

const runTemplate = async template => {
  const baseDir = process.cwd()
  const pkgPath = await pkgup({ cwd: __dirname })
  const pkg = require(pkgPath)
  let serverVersion
  try {
  	serverVersion = (await execa.command(`npm show ${BMO_HTTP} version`)).stdout
  } catch (e) {
  	logger.info(`Failed to get latest server version use fallback ${FALLBACK_VERSION}`)
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

const run = async () => {
  const ext = await extensions()
  const supportedTemplates = {
    project,
    dependency,
    resource,
    ...ext.templates
  }

  if (supportedTemplates[template]) {
    const formedTemplate = await supportedTemplates[template]({ name })
    runTemplate(formedTemplate)
  } else {
    throw new Error(`Unsupported template type ${template}`)
  }
}

run()
