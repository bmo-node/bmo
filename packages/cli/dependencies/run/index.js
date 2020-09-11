export default (({
  config: { pkg: { version }},
  dependencies: { logo, commander: program }
}) => () => {
  console.log(logo())
  console.log(`BMO CLI v ${version}`)
  program.parseAsync(process.argv)
})
