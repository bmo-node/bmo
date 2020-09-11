export default ({
  dependencies: {
    extensions: {
      packages,
      getExtensionsForType,
      types
    }
  }
}) => getExtensionsForType(packages, types.templates)
