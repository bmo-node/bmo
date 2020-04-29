# BMO Extensions

In addition to scaffolding out new applications and starting http services, the bmo cli allows you to
extend its functionality with npm packages.  They work by creating a package with either bmo-extension in the package name, or if it is a part of the @b-mo namespace
simply prepend extension to the package name IE: @b-mo/extension-my-custom-templates. Once you have created the package
you can either link/install it into your global `node_modules` or install it locally to your project with your favorite package manager.
Extensions currently come in two flavors: commands, and templates.

# Commands
Command extensions allow you to add new subcommands to the bmo cli. These can do pretty much what ever you can think up.

BMO uses [commander](https://github.com/tj/commander.js/) to implement it's cli.
When creating an command extension you can define it one of two ways. As either an action or an external file.

A basic extension looks like this. Your module should export something like:

```
import path from 'path'
export default {
  commands: {
    myCommand:{
      format: 'myCommand [params]',
      description: 'my command that does some stuff'
      action: (params)=>{}
    },
    myOtherCommand:{
      format: 'myOtherCommand [params]',
      description: 'my command that does some stuff'
      file: path.resolve(__dirname,'./myCommand')
    }
  }
};
```

If any conflicts between modules are found, then you just need to append a namespace to the command: `myModule.myCommand`

# Templates

During development you may find that you have to write the same boilerplate code over and over again.
BMO provides you the ability to create new templates and add them to the `create` commands arsenal.
You can add new templates to the create command by exporting something like the example below from your module.

```
import path from 'path'
export default {
  templates: {
    customTemplate: async () => ({
      questions: [//array of [inquirer](https://github.com/SBoudrias/Inquirer.js/) questions],
      preProcess:({files, answers})=>{
        //process files and answers
        //return modified files/answers
        return {files, answers}
      },
      postProcess:async ({files,answers})=>{
        // do any clean up or post create actions like install new dependencies
      },
      files: {
        //These are files that will be generated.
        foo: (answers)=>`some file content`,
        bar: (answers)=>`some file content`
      }
    })
  }
};
```
After installing your extension somewhere where BMO can find it you can use `bmo create customTemplate`
to invoke the newly created template.

