import commander from 'commander'
import logger from './logger'
import logo from './logo'
import packageman from './packageman'
import commands from './commands'
import run from './run'
import extensions from './extensions'
import program from './program'
import templates from './templates'
import runTemplate from './runTemplate'
export default {
  commander: () => commander,
  logger,
  logo,
  commands,
  packageman,
  extensions,
  program,
  run,
  templates,
  runTemplate
}
