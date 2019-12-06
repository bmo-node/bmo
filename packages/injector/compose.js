/* eslint-disable no-await-in-loop */
export default functions => {
  return async startVal => {
    let value = startVal
    for (const element of functions) {
      value = await element(value)
    }

    return value
  }
}
