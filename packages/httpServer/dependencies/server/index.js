export default async ({
  config,
  dependencies: { app }
}) => app().listen(config.get('server.port'))
