export default (({
  config: { pkg: { version }},
  dependencies: { logo, commander: program }
}) => () => {
  console.log(logo())
  console.log(`BMO CLI v ${version}`)
  if (program.parseAsync) {
    return program.parseAsync(process.argv)
  }

  return program.parse(process.argv)
})
