
# BMO CLI

BMO CLI is an  extensible command line interface for improving your work flow.
Using its extensions you can easily startup a BMO http server, or even generate new projects and components.

## Setup

install the bmo cli with your package manager of choice:

`npm install -g @b-mo/cli`

`yarn global add @b-mo/cli`

This will make the `bmo` command available in your terminal. From there you can use any commands you need.
When using bmo in a npm module it is suggested that you install it locally to that project so you do not need
any globally installed dependencies. Its more convenient to use the global `bmo` command to generate
new resources and dependencies,

## Extensions

BMO cli allows users to extend its functionality through extensions.
During startup BMO will search your global node_modules, and if using yarn global modules/links for
any packages with bmo-extension in it. If found it will attempt to load the extension into the cli.

### Extension commands
Extension commands allow users to define custom bmo actions packages that developers can install and use as
required. You can add a new sub-command to BMO by creating a package as follows:

BMO uses [commander](https://github.com/tj/commander.js/) to implement it's cli.
When creating an command extension you can define it one of two ways. As either an action or an external file.

A basic extension looks like this. Your module should export something like:

```
import path from 'path'
export default {
  commands: {
    myCommand:{
      format: 'myCommand [params]',
      description: 'my command that does some stuff',
      action: ({ config, dependencies:{ logger } }) => (params) => {}
    },
    myOtherCommand:{
      format: 'myOtherCommand [params]',
      description: 'my command that does some stuff',
      file: path.resolve(__dirname,'./myCommand')
    }
  }
};
```

If any conflicts between modules are found they become namespaced by their packagename: `myModule.myCommand`

The result will be that when a user invokes `bmo myCommand` your custom extension code would be executed.




