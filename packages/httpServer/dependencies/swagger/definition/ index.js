export default async ({
  config,
  dependencies: {
    routes = [],
    swagger: {
      createSwaggerDefinition
    }
  }
}) => {
  // Const { description, version, name: title, author: contact } = config.pkg
  return createSwaggerDefinition([ ...routes ], { title, description, contact, version })
}
//
