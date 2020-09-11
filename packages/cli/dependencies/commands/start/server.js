import { set, get } from 'lodash'
import bundle from '@b-mo/bundle'
import es6Require from '@b-mo/es6-require'
import fs from 'fs'
const STATIC_FILES_CONFIG_PATH = 'server.static'
export default () => async ({ args, cwd }) => {
  const ROUTES_PATH = `${cwd}/routes`
  let b = bundle().setRoot(cwd)
  await b.load()
  if (b.bundle.extends) {
    throw new Error(`Cannot override module extenstion ${b.bundle.extends}, use bmo run extenstion instead`)
  }

  if (fs.existsSync(ROUTES_PATH) && !b.bundle.dependencies.routes) {
    b.bundle.dependencies.routes = es6Require(ROUTES_PATH)
  }

  b.bundle.extends = '@b-mo/http-server'
  const { serve = []} = args
  const staticFiles = [ ...serve, get(b.bundle.config, STATIC_FILES_CONFIG_PATH, []) ]
  set(b.bundle.config, STATIC_FILES_CONFIG_PATH, staticFiles)
  await b.run()
  return b
}
