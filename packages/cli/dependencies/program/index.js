export default ({
  config: {
    pkg = {}
  },
  dependencies: {
    commander: program
  }
}) => program.version(pkg.version)

