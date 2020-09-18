export default ({ dependencies: { commander }}) => {
  const collect = (value, previous) => previous.concat([ value ])
  commander
    .option('-s, --serve <folder>', 'Adds a folder to be served statically', collect, [])
    .allowUnknownOption()
  return commander.parse(process.argv)
}
