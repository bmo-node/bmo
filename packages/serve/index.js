import start from './start'
export default {
  commands: {
    serve: {
      format: 'serve',
      description: 'Starts a BMO service with the module in the current directory',
      action: start
    }
  }
}
