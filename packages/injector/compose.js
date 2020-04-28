/* eslint-disable no-await-in-loop */
// Disabled because we want to call each function in serial
// passing the return value of the previous one to the next one
export default functions => {
  return async startVal => {
    let value = startVal
    for (let i = 0; i < functions.length; i++) {
      value = await functions[i](value)
    }

    return value
  }
}
