import chalk from 'chalk'

const log = message => {
  info(message)
}

const info = message => {
  console.log(chalk.green(message))
}

const warn = message => {
  console.log(chalk.yellow(message))
}

const error = message => {
  console.log(chalk.red(message))
}

log.info = info
log.warn = warn
log.error = error
export default log
