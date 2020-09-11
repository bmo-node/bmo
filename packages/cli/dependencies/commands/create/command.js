
export default ({
  dependencies: {
    program,
    logger,
    commands: { create: { run }}
  }
}) => program
  .command('create <template> [name]')
  .description('creates a BMO http application')
  .action((template, name) => run({ template, name }))

