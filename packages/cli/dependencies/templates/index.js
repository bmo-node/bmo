import service from './service'
import dependency from './dependency'
import resource from './resource'
export default ({
  dependencies: {
    logger,
    packageman,
    extensions: {
      templates: extensionTemplates
    }
  }
}) => ({
  service: service({
    dependencies: {
      logger,
      packageman
    }
  }),
  dependency: dependency(),
  resource: resource(),
  ...extensionTemplates
})
