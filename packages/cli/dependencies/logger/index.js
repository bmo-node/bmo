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

const debug = message => {
  console.log(chalk.magenta(message))
}

log.info = info
log.warn = warn
log.error = error
log.debug = debug
log.log = console.log

const logger = () => log

logger.warn = warn
logger.error = error
logger.info = info
logger.debug = debug
logger.log = console.log
export default logger
