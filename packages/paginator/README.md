# @lmig/bmo-paginator

This module provides an easy to use function to generate paged urls for list routes.
It expects the following config values to be available in your manifest:
```
{
    server: {
      host
    }
  }
}
```

To use the module you can destructure it and use it in your code.

```
const pages = paginator({ total, offset, limit, resource, params })
console.log(pages)
```

Pages will look like:

```
{
  prev:`${host}${resource}?offset=${prevOffset}&limit=${limit}${params}`,
  next:`${host}${resource}?offset=${nextOffset}&limit=${limit}${params}`,
  self:`${host}${resource}?offset=${currentOffset}&limit=${limit}${params}`,
  last:`${host}${resource}?offset=${lastOffset}&limit=${limit}${params}`,
}

```
If not needed, the params field can be left empty, and no parameters will be appended to any of the urls.
The params object should follow this format:

```
{
  <paramName>: <paramValue>
}
```
The paginator will reduce each key value pair in the params object into one string that looks like this:
```
`&${paramName}=${paramValue}`
```


Client side you can use these to iterate over all the pages.
If there is no next or prev page or you are already on the last page then those fields are not included in the return value.
