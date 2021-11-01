export default () => consumer => new Promise((resolve, reject) => {
  consumer.commit((err, result) => {
    if (err) {
      return reject(err)
    }

    resolve(result)
  })
})
