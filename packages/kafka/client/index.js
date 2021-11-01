export default ({
  dependencies: {
    kafka: {
      KafkaClient
    }
  },
  config: {
    kafka: {
      client: clientConfig
    }
  }
}) => overrideConfig => new KafkaClient({ ...clientConfig, ...overrideConfig })
