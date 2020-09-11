
const collect = (value, previous) => previous.concat([ value ])

export default ({
  dependencies: {
    program,
    logger,
    commands: { start: { run }}
  }
}) => {
  program
    .command('start')
    .description('start an application server in the current directory')
    .option('-d, --dev', 'Starts a watch on the base directory to look for changes')
    .option('-s, --serve <folder>', 'Adds a folder to be served statically', collect, [])
    .action(run)
}
