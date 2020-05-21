
import es6Require from '@b-mo/es6-require'
import path from 'path'
export default {
  commands: {
    run: {
      format: 'run',
      description: 'runs the application defined in the current directory',
      file: path.resolve(__dirname, './run.js')
    }
  }
}
