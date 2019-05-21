React boilerplate with ES2015, Express.js, and Webpack

This is intended for, and has been tested with, Chrome, Firefox, Safari, Microsoft Edge and IE. 

## Technologies

- React (v16) + Redux (v3) + React Router (v4)
- Express.js (v4) as production and development server
- Webpack 4 (production and development configurations)
- SCSS support
- ES2015+

## Running the App
```bash
# run development mode (source maps, etc...)
npm run dev

# run local build (not minified and not in a honeycomb)
npm run start:local

# run production mode (minified, obfuscated, cache busted, etc...).
# if deploying to a honeycomb, this will configure the application to run behind an API gateway (Zuul)
npm start

# run lint
npm run lint

# run unit tests
npm run test:unit

# run feature tests (selenium tests)
npm run test:feature
```

The expectation is that for local development, `npm run dev` will be used, and for deployed artifacts, `npm start` will be used (`start` is not currently configured to run locally).

### Running in a Honeycomb, Deployed to DDC
There is a `gateway` webpack configuration file to allow the application to be run inside a honeycomb (i.e. behind an API gateway like Zuul). In the `package.json` file, you will want to use `webpack.config.gateway.js` in the `scripts.build:client` task. 

#### Application Route
If you are using Zuul as your gateway, you can add an explicit route to your app via these configuration properties:

```yaml
zuul:
 routes:
   bmo-v0:
     path: /bmo-v0/**
     url: http://bmo-v0:8080
```

By default, the Zuul application configuration can be found in your honeycomb's configuration repository, in `dna-service-gateway.yml`.

#### Making Calls from Client to the Server
The application route needs to be included in the URL when making calls to the server running inside a honeycomb (should match the `path` in the zuul route above).  The webpack configuration can be used to inject the application route at build time.  This can be done in such a way so that the same calls to the server work when running locally (not in a honeycomb) and when running in a deployed environment in a honeycomb.

This example shows how to add an environment variable (`APP_PATH`) to the webpack configuration.  It is set to empty string by default (see `webpack.config.common.js`), and in the `package.json` the script `build:client` is setting it to the application route.  In `App.js`, the `process.env.APP_PATH` is referenced when making a call to the server.  This will be replaced by the value of the environment variable at build time.

Example in BitBucket: [https://git.forge.lmig.com/projects/DNAGISTS/repos/react-honeycomb-example/commits/640d8a61612019a2ffc609f2c1396f9555e8ad8b]

### Running standalone 
There is a `deployed` webpack configuration file to allow the application to be run standalone (i.e. not using an API gateway like Zuul). In the `package.json` file, you will want to use `webpack.config.deployed.js` in the `scripts.build:client` task.

## Service Logs

For deployed applications on Fusion you will need to query [Splunk](https://libertymutual.splunkcloud.com/en-US/app/search/search) for your application's server logs.

Enter this into the search to get all of your server logs for this application in all non-prod environments: 

`index=docker_uscm_nonprod "attrs.project.name"="bmo"`

You can further refine your search using labels found in the `logging.options.labels` of your service in the `docker-compose.yml` of your deploy project, for example platform.env, application.name, domain.uscm, etc.

For querying on Cloudforge, [follow these instructions.](https://forge.lmig.com/wiki/display/STAC/Application+Logging)
