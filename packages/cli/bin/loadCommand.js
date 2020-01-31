export default program => (cmd, key) => {
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

    if (cmd.options) {
      command.options.forEach(opt => {
        program.option(opt.format, opt.description)
      })
    }

    program.action(cmd.action)
  }
}
