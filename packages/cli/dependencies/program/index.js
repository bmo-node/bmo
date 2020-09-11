export default ({ config: { pkg: { version }}, dependencies: { commander: { program }}}) => program.version(version)
