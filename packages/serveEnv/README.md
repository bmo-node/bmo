
# BMO Serve Env

This provides a service endpoint that serves the environment block in your configuration.

**__DO NOT PUT SECRETS IN THE ENVIRONMENT PORTION OF THE CONFIG IF YOU ARE USING THIS PACKAGE__**
**__THEY WILL BE SERVED AND EXPOSED THROUGH THE SERVICE INTERFACE__**


## Setup

install the bmo cli with your package manager of choice:

`npm install @lmig/bmo-serve-env`

`yarn add @lmig/bmo-serve-env`

include in your dependencies
```
// dependencies/index.js
import serveEnv from '@lmig/bmo-serve-env'
export default {

  //...
  serveEnv

}

//config/index.js
{
    environment,
    routes: {
      environment:'/api/environment/v1'
    }
  },
```

The environment key in the config will be served as an endpoint at '/api/environment/v1' by default.
It can be overridden by assigning a new value to the routes.environment config value.


If using bmo modules you can use:

`bmo add @lmig/bmo-serve-env`

to avoid having to manually add it to your dependencies block.
It can be configured according to the instructions stated above.



