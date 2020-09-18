import bundle from '@b-mo/bundle'
import dotenv from 'dotenv'
dotenv.config()
const run = async () => {
  bundle().run()
}

run()
