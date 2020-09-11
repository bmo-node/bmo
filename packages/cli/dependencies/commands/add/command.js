
export default ({
  dependencies: {
    program,
    commands: { add: { run }}
  }
}) => program
  .command('add <pkgName>')
  .arguments('as [newName]', 'Add package with alias')
  .description('Adds an npm module to the bmo dependencies. The package is installed if it does not exist already')
  .action((installTarget, as, cmd, [ alias ] = []) => run({ installTarget, alias }))
