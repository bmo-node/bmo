# BMO HTTP SERVER

BMO HTTP SERVER is a server side framework, focused at enabling developers to quickly implement high quality Restful services,
but it can be used to implement any kind of http server.
Aims to reduce boiler plate code by having an opinionated project structure, and provide
flexibility in code by providing robust unobtrusive dependency injection.

## Project structure
BMO expects your project to be structured with some folder.
In the 'baseDirectory' BMO expects there to be several folders
```
|-\
|--config
|--dependencies
|--routes
```
BMO expects the top level modules to export certain things.

### Config

The config directory is expected to export an async function that takes in an object parsed from the command line.

```
export default async cliParams =>({
  // my configuration object
  })
```

### Dependencies
The dependencies directory should export an object. each key on the object should be either: another object, an array, or a function (async or sync).
Each leaf function will be invoked with the manifest generated by running it through BMO's DI framework
each return value will be available in the dependencies portion of the manifest. see [bmo-injector](../injector) for more information on how dependency injection is done.
Example dependencies export
```
import foo from 'foo'
import bar from 'bar'
export default {
  foo,
  bar
}
```

Example dependency:
```
export default async ({ config, dependencies: { foo } }) => ({
    // my module object
  })
```

### Routes
The routes folder is where you declare your routes.
It should export an array of functions that when invoked returns a route object,
alternatively it can be a dependency that returns an array.

With Routes:
```
import fooRoute from './fooRoute'
export default [fooRoute]
```

Without Routes:
```
export default () => []
```

```
// fooRoute.js
export default async ({config, dependencies}) => ({
  path:'api/things/v1/',
  method:'post',
  schema:{
    requestBody,
    responseBody
  },
  handler:async(ctx,next)=>{}
})
```
- `path` - indicates what the path to the handers should be.
- `method` - is the http method that the handler is for.
- `schema`- an optional schema takes in two sub objects, these objects should be [joi](https://www.npmjs.com/package/@hapi/joi) schemas that are then used to
generate OpenAPI documentation for the resources. These are optional and will be ignored if not supplied.
-- if request body is supplied then incoming requests will be validated against the schema.
- `handler`- Is an async function that is invoked when a request is received with the given path and method.

### Adding Custom Middleware

In some cases you may want to add middleware to your http routing. You can add middleware at both the route
and the application level.

To do this at the application level you add a key to your dependencies called middleware, and
add your module to an array under it.

```
// dependencies.js
import fooMiddleware from './fooMiddleware'
export default {
  middleware:[
    fooMiddleware
  ]
}

```

```
// fooMiddlware.js
export default async ({config, dependencies})=>(ctx,next)=>{}
```

To add middleware at the route level create a module and add it to your dependencies as normal

Then in your route handler instead of a function use an array with your handler as the last entry in the router:

```
export default async ({config, dependencies:{ fooMiddleware } }) => ({
  path:'api/things/v1/',
  method:'post',
  schema:{
    requestBody,
    responseBody
  },
  handler:[fooMiddlware, async(ctx,next)=>{}]
})
```

### Error Handling

The framework includes an error handeling middleware. All of the handlers are wrapped so you can
throw errors from your handler and the framework will log and send the message back to the user.
If you have a custom status mapped for the error type the response will have the status, otherwise it defaults to 500.

Below is an example of how to use the errors, errorMap and built in error handling

```
//customErrors.js

export default ({ dependencies:{ errorMap, errors:{ ExtendableError } } })=>{
  class CustomError extends ExtendableError
  errorMap.addError(CustomError, 420)
}
//SomeRoute
export default async ({ config, dependencies:{ errors:CustomError } }) => ({
  path:'api/things/v1/',
  method:'post',
  schema:{
    requestBody,
    responseBody
  },
  handler:async(ctx,next)=>{
    throw new CustomError('Custom Error')
    }
})
// The http status of the call would be 420 and the message would be custom error
```


### Built-in modules

By default bmo ships with some built-in modules.

#### errorMap

The error map module is useful for mapping error types to http status codes.
The error map controls which status is returned when a handler throws a specific type of error.




#### errors

This module houses errors used by the framework. It exposes an ExtendableError for use in your custom errors

#### events

This is a shared instance of an event emitter. You can use it like any other event emitter.
The following is an example of a module that listens for the shutdown event.
It is recommended that you keep your event names in the config to avoid typos!

```
//dbShutdown.js
export default ({ config:{ events:{ shutdown } }, dependencies:{ events, db }) => {
  events.on(shutdown,()=>db.pool.close())
}

```

the Shutdown config value is provided as a default config value.

#### gracefulShutdown

This module pairs with the events module. It broadcasts the shutdown event when the process is about to exit.

#### health

This module implements a health check for the application at /health.

#### logger

This is a simple string logging module. It provides an info(msg) warn(msg) and error(msg) with some color.

#### middleware

Some middleware is included by default.
- [Body parsing](https://github.com/koajs/bodyparser)
- [request logging](https://github.com/pinojs/koa-pino-logger)
- [helmet](https://www.npmjs.com/package/koa-helmet)
and a top level error handling middleware are all provided by default.

#### requestValidator

This is used internally by the framework to validate your incoming requests if a requestBody schema is provided

#### serveStatic

This middleware can be used to create other middleware to serve your static files.
```
//customStaticFiles.js
export default ({config:{staticFolder}, dependencies:{serveStatic}})=>serveStatic(staticFolder)

//dependencies.js
import customStaticFiles from './'
export default {
  middleware:[customStaticFiles]
}
```

Additionally any entries in `config.server.staticFiles` will be mounted for serving.

#### swagger

This module creates routes for you app to have open api documentation. This is all based off of the schemas
that you pass to your route handlers.

Path parameters will be calculated from the path field in your route object.
```
path:'api/things/v1/:id', //parameter is id
```

Query parameters are calculated from the Joi schema assigned to `schema.queryParams`
```
schema:{
  queryParams: joiSchema
},
```

Request/response samples are calculated from the Joi schema assigned to `schema.responseBody` and `schema.requestBody`
```
schema:{
  requestBody: joiSchema //ignored for GET methods 
  responseBody: joiSchema
},
```