export default () => fn => message => {
  try {
    const parsed = JSON.parse(message.value)
    return fn(parsed)
  } catch (e) {
    console.log('Failed to parse', message, e)
  }
}
