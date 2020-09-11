export default async ({
  config: {
    server: {
      port,
      staticFiles = []
    }
  },
  dependencies: { app }
}) => app().listen(port)
