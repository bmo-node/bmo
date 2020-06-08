#!/usr/bin/env node
import commander from 'commander'
import dev from './dev'
import { fork } from 'child_process'
import logger from '../../../logger'
const esm = require.resolve('esm')

function collect(value, previous) {
  return previous.concat([ value ])
}

commander
  .option('-d, --dev', 'Starts a watch on the base directory to look for changes')
  .option('-s, --serve <folder>', 'Adds a folder to be served statically', collect, [])

logger.warn('bmo start will be deprecated in a future version of this package, you will instead have to install: @b-mo/extension-run and use the new composable bundle feature to run your application.')

const cwd = process.cwd()
commander.parse(process.argv)
try {
  if (commander.dev) {
    console.log('starting dev...')
    dev({ args: commander, cwd })
  } else {
    const args = commander.rawArgs.slice(2)
    fork(`${__dirname}/staticServer.js`, args, { cwd, execArgv: [ '-r', esm ]})
  }
} catch (e) {
  console.error('Unable to load configuration. Ensure that a config directory is in the current directory')
  console.error(e)
  process.exit(1)
}
