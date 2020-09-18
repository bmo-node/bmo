// This package is a side effect that loads any extension
// commands into the bmo DI context
import { each } from 'lodash'

export default ({
  config: { pkg: { version }},
  dependencies: { commander: program, extensions: { commands }, logger }
}) => {
  program.version(version)
  each(commands, (cmd, key) => {
    logger.debug(`Loading command ${key}`)
    const executableFile = cmd.file
    if (executableFile) {
      program.command(cmd.format, cmd.description, { executableFile })
    } else {
      if (!cmd.action) {
        throw new Error(`command ${key} must define either action or file`)
      }

      program
        .command(cmd.format)
        .description(cmd.description)
        .action(cmd.action)
    }
  })
}
