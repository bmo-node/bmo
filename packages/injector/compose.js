/* eslint-disable no-await-in-loop */
export default functions => {
  return async startVal => {
    let value = startVal
    for (let i = 0; i < functions.length; i++) {
      value = await functions[i](value)
    }

    return value
  }
}
