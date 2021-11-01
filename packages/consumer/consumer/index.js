export default ({
  config: {
    kafka: {
      topic
    }
  },
  dependencies: {
    bmoKafka: {
      consumer
    }
  }
}) => consumer(topic)
