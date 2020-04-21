# BMO MOCKER

This module is meant to help you test your modules faster. It loads your dependencies and configuration for your app
and provides you an interface to swap out modules before building your module for testing. Currently the module assumes that your
directory structure has a `config` and `dependencies` folder in the directory where you run your test process.
Those folders should contain your bmo config and your dependency modules.

#Example usage

```
import mocker from '@lmig/bmo-mocker';
import fooModule from '.';

const container = mocker();
container.mock('barDep', { barSvc:()=>[{ baz:'bar' }] });
const fooInstance = await container.build(fooModule);
expect(fooInstance.getBars()).toEqual({ baz:'bar' });
```


#API

```
const container = mocker({ config, dependencies })

config - An object containing values you wish to override in your test configuration.
dependencies - A set of modules to use as dependencies instead of the default ones.
returns an IOC container for building your test modules.

```

```
container.extend(package)

either an object with a dependencies key or the name of a package
that exposes a dependencies property. The dependencies will be included
when the container is built.

```

```
container.mock(dependencyName, dependencyValue);

dependencyName - A json path for the mock you wish to set.
dependency - the thing you want to be passed to the module instead of the normal module.
returns the container for chaining

```

```
container.set(configPath, configValue)

configPath - A json path for the value you want to override in the config
configValue - the value you want instead of the default one.
returns the container for chaining
```

```
const moduleInstance = await container.build(module)

module - the base module you would like to be instantiated
returns the created module with the mocked values instead of the normal dependencies.

```

TODO:
Integrate with BMO modules, currently they are only respected by the http server but this module should load them too.
