import program from 'commander'
import { each } from 'lodash'
import pkg from '../package.json'
import logo from '../logo'
import extensions from '../extensions'
import loadCommand from './loadCommand'
console.log(logo())
console.log(`BMO CLI v${pkg.version}`)

const run = async () => {
  const ext = await extensions()
  program
    .version('0.1.0')
  each(ext.commands, loadCommand(program))
  program.parse(process.argv)
}

run()
