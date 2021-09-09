
const simpleProducer = (topic, producer) => ({
  async send(payload) {
    return new Promise((resolve, reject) => {
      console.log(topic, payload)
      producer.send([{
        topic,
        messages: JSON.stringify(payload)
      }], (err, result) => {
        if (err) {
          return reject(err)
        }

        resolve(result)
      })
    })
  }
})

export default ({
  dependencies: {
    kafka: {
      Producer
    },
    client
  },
  config: {
    kafka: {
      producer: defaultProducerConfig
    }
  }
}) => (topic, producerConfig, clientConfig) => new Promise((resolve, reject) => {
  const fullConfig = { ...defaultProducerConfig, ...producerConfig }
  const producer = new Producer(client(clientConfig), fullConfig)
  let ready = false
  console.log('Starting producer...')
  producer.on('error', error => {
    console.log(error)
    if (!ready) {
      reject(error)
    }
  })
  producer.on('ready', () => {
    ready = true
    resolve(simpleProducer(topic, producer))
  })
})
