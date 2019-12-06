export default modulePath => {
  const importedModule = require(modulePath)
  if (importedModule.__esModule && importedModule.default) {
    return importedModule.default
  }

  return importedModule
}
