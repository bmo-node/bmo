# Static Site

The @b-mo/http-server package has some built in functionality to serve static files.
Making it a breeze to use bmo to serve your static content in a deployed environment.
Additionally you can use the @b-mo/serve-env package to serve up environment based configurations to your frontend easily and securely.


To get started you can begin running your favorite frameworks respective application generator.
The main requirement here is that your project outputs its built files into a build directory of some sort.

Once your project is generated install the following dependencies

```sh
npm install @b-mo/cli @b-mo/extension-run @b-mo/http-server
```

after that add the following to your package.json

```json
{
  "bmo":{
    "extends":"@b-mo/http-server"
  }
}
```

Now you can make the command that starts your application in production something like:

```sh
bmo run -s ./build
```

Replacing the build folder with your output folder.

If you require additional files to be served you can use additional `-s` flags or create a config
folder in the root of your project and populate the `server.staticFiles` key with an array of the folders you would liked
served.

Now you can test the application is working by doing your build and trying to run the application.

Once you have the files being served if you require configuration based on an environment you can use the `@b-mo/serve-env`
to easily create an endpoint in your server to send down client side configuration information.

**NEVER SEND SECRET INFORMATION DOWN TO A CLIENT**

You can add the package to your project by running

```sh
bmo add @b-mo/serve-env
```

This will add the package to your server and automatically create a route for you that returns
the `environment` value from your config file. If you haven't already create a config folder in the root of your project
and drop an index.js file in there.

```js
export default {
  environment:{
    //... your default configuration values
  }
}
```
Additional configurations can be created by making new a new ${NODE_ENV}.config.js and the server will
load the appropriate configuration and serve it on startup.

All that is left is to


