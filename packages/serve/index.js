import path from 'path'
import start from './start'
export default {
  commands: {
    add: {
      format: 'add',
      description: 'adds a dependency to the application and will be loaded automatically when served',
      file: path.resolve(__dirname, './add/index.js')
    },
    serve: {
      format: 'serve',
      description: 'Starts a BMO service with the module in the current directory',
      action: start
    }
  }
}
