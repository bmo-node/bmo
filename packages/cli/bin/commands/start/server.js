import httpServer from '@b-mo/http-server'
import bundle from '@b-mo/bundle'
import es6Require from '@b-mo/es6-require'
import fs from 'fs-extra'
import { set } from 'lodash'

export default async ({ config, args, cwd }) => {
  const appBundle = bundle({ dir: cwd })
  const routesPath = `${cwd}/routes`
  await appBundle.load()
  if (fs.existsSync(routesPath)) {
    const routes = es6Require(routesPath)
    appBundle.bundle.dependencies.routes = routes
  }

  appBundle.bundle.extends = httpServer
  appBundle.run()
}
