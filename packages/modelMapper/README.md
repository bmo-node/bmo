# @lmig/bmo-model-mapper


This module provides a simple interface for mapping on model to another model.

To use it include it in your dependencies and destructure it off of your manifest.

modelMapper is a functor that takes an object that acts as a map between properties.

IE

```
const map = {
  'foo.baz':'bar'
}

```

```
({ dependencies: { modelMapper } }) => {
  const mapModel = modelMapper(map)
  const result = mapModel({
    bar:5
  })
  console.log(result)
}

```

Outputs:
```
{
  foo:{
    baz:5
  }
}
```
