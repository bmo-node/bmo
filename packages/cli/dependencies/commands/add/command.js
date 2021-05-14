
export default ({
  dependencies: {
    program,
    commands: { add: { run }}
  }
}) => program.command('add <pkgName>')
  .option('--as <newName>', 'Add package with alias')
  .description('Adds an npm module to the bmo dependencies. The package is installed if it does not exist already')
  .action((pkgName, { as: alias }, cmd) => {
    return run({ installTarget: pkgName, alias })
  })
