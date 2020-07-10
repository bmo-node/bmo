# @b-mo/bundle

This packages loads and resolves a dependency bundle. It allows you to easily extend dependency bundles
so that you can compose applications together easily.

Install the bundle package using whatever package manager you are using these days:

```npm i @b-mo/bundle```

```yarn add @b-mo/bundle```


By default then bundle will be loaded from the current working directory but you can override it with params

```
import bundle from '@b-mo/bundle'

const b = bundle({ dir:'my/other/dir' })

bundle.run(...runArgs)

```

## API

Constructor:

```
const b = bundle(config);
```
config:
```
{
  dir // the directory to use as a root for the bundle
}
