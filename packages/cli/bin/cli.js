import bundle from '@b-mo/bundle'
import path from 'path'
const root = path.resolve(`${__dirname}/../`)
bundle().setRoot(root).run()
