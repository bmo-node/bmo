# BMO DI

The DI or dependency injection that BMO supplies is meant to be totally unobtrusive.
Simply attach your constructor to the root dependencies export, and deconstruct your modules dependencies
off of the manifest passed to each constructor.

#### Why dependency injection over `import`?

When you import a module, your are coupling your module directly to the imported module.
References to dependencies are hard coded and strewn throughout the code base.
If you need to change a dependency or module you have to update every reference to it and ensure that
the interface was not broken. Using dependency injection allows you to wrap your
external dependencies in modules that are then shared through the DI framework.
Any changes or updates are isolated to the one module, and percolated from that single point.


#### Database module Example

```
export default async ({ config, dependencies :{ connectionPool } }) => ({
    query:async (query) => {
      const connection = await connectionPool.getConnection();
      const result = await connection.execute(query)
      return result;
    }
  })
```

During application start up BMO has 3 phases, configuration, injection, and running.
First BMO resolves the config function. After that it instantiates all the dependency modules.
During this process it inspects each module's constructor to ensure that all of it's dependencies are available.
It does this by parsing the functions AST. Currently it is well tested using the destructure syntax, It also attempt's to find any
accesses to the first parameters 'dependencies' key if the destructure syntax is not used.
Using other syntax may create different AST formats that may not be supported.


## Known Limitations

### You can only desctructure down to the module level.

Individual objects passed that are not available to destructure from the constructor
You cannot destructure past your root dependency name. IE

```
// myDependency.js
export default ({config, dependencies})=>({
  foo:()=>{},
})


// otherDependency.js

export default ({config, dependencies:{myDependency:{foo}}})=>{}

```

In this case BMO will throw an error about a missing dependency myDependency.foo. This is because BMO tries to find the constructor at
myDependency.foo, but its not available until after myDependency has been created.


### Any other tools that modify the AST of your code may break dependency injection

Using transpilers, minifiers, or uglifiers that modify the AST may or may not work. (probably won't)

