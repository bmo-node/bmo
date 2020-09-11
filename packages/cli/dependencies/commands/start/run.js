import fs from 'fs'
import dotenv from 'dotenv'
export default ({
  dependencies: {
    logger,
    commands: { start: { server }
    }
  }
}) => async (...restArgs) => {
  const commander = restArgs[restArgs.length - 1]
  logger.warn('bmo start will be deprecated in a future version of this package, you will instead have to install: @b-mo/extension-serve and use that for server capabilities')
  const cwd = process.cwd()
  try {
    dotenv.config()
    let s = await server({ args: commander, cwd })
    let restarting = false
    fs.watch(`${process.cwd()}`, { recursive: true }, async () => {
      if (restarting) {
        return
      }

      restarting = true
      logger.info('Change detected! Stopping...')
      await s.stop()
      logger.info('Stopped....')
      Object.keys(require.cache).forEach(function (key) {
        delete require.cache[key]
      })
      logger.info('Cache cleared')
      setTimeout(async () => {
        s = await server({ args: commander, cwd })
        logger.info('Restarted!')
        restarting = false
      }, 500)
    })
    // TODO Dev loop...
  } catch (e) {
    logger.error('Unable to load configuration. Ensure that a config directory is in the current directory')
    logger.error(e)
    process.exit(1)
  }
}
