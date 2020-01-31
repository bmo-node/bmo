
# BMO CLI

BMO CLI is an  extensible command line interface for improving your work flow.
Using its extensions you can easily startup a BMO http server, or even generate new projects and components.

## Setup

install the bmo cli with your package manager of choice:

`npm install (-g) @b-mo/extension-serve`

`yarn global (global) add @b-mo/extension-serve`

This will make the `serve` extension available to the bmo cli.
From there you can use any commands supplied by this module

## Commands

### Serve

`bmo serve`

|Option          | Description                                              |
|----------------|----------------------------------------------------------|
|-d              | Start the server in dev mode, changes restart the server |
|-s <dir>        | Add a directory to be served as static assets            |
|-c <dir>        | Set the base directory where BMO looks for the config    |
|--baseDir <dir> | Set the base directory for BMO's entry point.            |

This command starts up a bmo http server in the current directory.

### Add

`bmo add <pkg@version> [as <alias>]`

This will add the given package as a dependency and include it in your manifest automatically.


|Option          | Description                                              |
|----------------|----------------------------------------------------------|
|as <alias>      | When injected into the manifest it will use this instead |
|                | of the module name.                                      |




