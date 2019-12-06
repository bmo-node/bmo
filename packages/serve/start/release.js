import fs from 'fs'
import dotenv from 'dotenv'
import { load } from '@b-mo/config'
import startServer from './startServer'
dotenv.config()
export default ({ args = {}, cwd }) => {
  let config = {}
  try {
    const configPath = args.configDir || `${cwd}/config`
    if (fs.existsSync(configPath)) {
      config = async () => load(configPath)
    } else {
      config = async () => ({})
    }
  } catch (error) {
    console.error('Unable to load configuration. Ensure that a config directory is in the current directory')
    console.log(error)
    process.exit(1)
  }

  startServer({ config, args, cwd })
}
