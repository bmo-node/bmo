# BMO Microservice

This guide focuses on creating a microservice based off of bmo http server and the bmo cli.

First ensure that you have the bmo cli installed globally.

you can use the bmo generators to create the skeleton of your microservice quickly.

You can run `bmo create project <projectName>` To get a project started.

Once you answer the questions and let your package manager install your dependencies you can start
adding resources to your service with the following command

`bmo create resource <resourceName>`

This command will stub out a set of resources in `/routes/<resourceName>/<resourceVersion>`

from here modify your index.js file in the '/routes' folder to import your handlers and spread them into your routes module like so:

```
import myResourceV1Handlers from './myResource/v1/handlers'

export default [...myResourceV1Handlers]
```

Make sure you change your routes module to export an array instead of the default function returning an array.


Now that you have your route handlers created it is time to define a schema for your resource

You can run the following to create a `schemas` dependency.

`bmo create dependency schemas`

This will create a folder in `dependencies/schemas`

From there import the schemas into your `dependencies/index.js` and attach it to the default export.

Open up your schemas file and from here you can define your schema using [joi](https://hapi.dev/module/joi/)
supplied by the bmo-http-server module. Simply destructure it from the dependencies in the module

```
export default ({ dependencies:{ joi } }) => ({
  myResource:joi.object({
      thing:joi.string()
    })
})
```

from here you can use the schema in your routes:

```
export default ({
  config:{
    routes:{
      test:{
        v1:testV1
      }
    }
  },
  dependencies:{
    schemas:{
      myResource:myResourceSchema
    }
    http:{
      methods:{
        PUT:method
      }
    }
  }
}) => ({
  path:`${testV1}`,
  schema:{
    responseBody:myResourceSchema,
    requestBody:myResourceSchema
  }
  method,
  handler:async (ctx,next)=>{}
})

```

The http server will automatically validate the incoming request body as well as provide detailed swagger
documentation at /docs when your service is run if you supply schemas for your resources.

From here you can implement your routes handler method as you see fit.

If your route requires route specific middleware your handler may also be an array of middleware that will be
run before your handler IE


```
export default ({
  config:{
    routes:{
      test:{
        v1:testV1
      }
    }
  },
  dependencies:{
    auth:{
      authenticate,
      authorize
    },
    roles:{
      admin
    },
    schemas:{
      myResource:myResourceSchema
    }
    http:{
      methods:{
        PUT:method
      }
    }
  }
}) => ({
  path:`${testV1}`,
  schema:{
    responseBody:myResourceSchema,
    requestBody:myResourceSchema
  }
  method,
  handler:[authenticate, authorize({allowedRoles:[admin]}), async (ctx,next)=>{}]
})

```

the http server comes with request and response logging by default, but you can modify the format by providing new
serializers to the logger.

You can also provide application level middleware by populating a dependency called 'middleware' with your
module definitions. Those will be added to the application middleware stack before any of your routes are mounted.


