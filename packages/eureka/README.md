# @lmig/bmo-eureka


This module wraps the eureka support into a bmo module. It provides several dependencies out of the box.

## installation

Install the module with your package manager of choice

`npm install @lmig/bmo-eureka`

then include the dependency in your project's dependencies.

```
//dependencies.js
import eureka from '@lmig/bmo-eureka'
export default {
  // other dependencies
  ...eureka
}
```
this package will provide the following modules:
  - dnaClient
  - eureka
  - eurekaClient

## dnaClient
This is http module provided to us by the DNA team. It is a simple wrapper around

## eureka
This module registers your service with the eureka instance. It expects these config values.

```
config: {
  eureka: {
      enabled = false,
      loggerLevel = 'debug'
    }
  }
```

They are both optional and disabled by default.


## eurekaClient
This is the module used to communicate with the eureka instance, it is used internally by the eureka module.
It expects these config values to be supplied by the user:
```
config: {
  eureka: {
      enabled = false,
      serviceUrl
    }
  }
```
