# BMO Module Loader


Loads the bmo modules defined in the package.json.


```
import loadModules from '@lmig/bmo-load-modules'

const modules = loadModules(process.cwd())

// outputs the bmo modules defined in the package.json
console.log(modules)
```
