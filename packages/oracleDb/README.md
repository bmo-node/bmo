# @lmig/bmo-oracledb


This module wraps the [oracledb]() module into a bmo module. It provides several dependencies out of the box.

## installation

Install the module with your package manager of choice

`npm install @lmig/bmo-oracledb`

then include the dependency in your project's dependencies.

```
//dependencies.js
import oracleDb from '@lmig/bmo-oracledb'
export default {
  // other dependencies
  ...oracleDB
}
```
this package will provide the following modules:
  - connectionPool
  - oracledb
  - execute

## oracledb
This is a simple module that wraps [node-oracledb](https://github.com/oracle/node-oracledb).

## connectionPool
This module starts up a connection pool to the oracle database.
It depends on the gracefulShutdown, events, logger, and oracledb modules.
It expects the following config values:
```
config: {
  oracledb: {
    connectString,
    user,
    password,
    poolAlias = 'database',
    poolMax = 15,
    autoCommit = true
  },
```

`connectString, user, and password` are all required to be defined in the user's config.
`poolAlias and poolMax` have default values defined, but may be overridden in the users config.

using this dependency you can get a connection by calling
`const connection = await connectionPool.getConnection()`
from there you can use the connection to query the database.
For reference to the connection you can see [node-oracledb](https://github.com/oracle/node-oracledb)

You can also close the connection with `await connectionPool.closeConnection(connection)`


### execute

This module uses the connectionPool module to execute an sql query.
It handles getting the connection, executing the query and closing the connection.

```
 export default ({config:{queries},dependencies:{execute}})=>({
    getUsers(){
      const results = await execute(queries.getUsers())
      const mapped = results.rows.map(someFn)
      return mapped
    }
  })
```
