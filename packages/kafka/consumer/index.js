export default ({
  config: {
    kafka: {
      consumer: defaultConsumerConfig
    }
  },
  dependencies: {
    kafka: {
      Consumer
    },
    client
  }
}) => (topic, consumerConfig, clientConfig) => {
  const { partition, ...fullConfig } = { ...defaultConsumerConfig, ...consumerConfig }
  const consumer = new Consumer(client(clientConfig), [{
    topic,
    partition
  }], fullConfig)
  return consumer
}
