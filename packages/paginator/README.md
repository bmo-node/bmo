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
const pages = paginator({ total, offset, limit, resource })
console.log(pages)
```

Pages will look like:

```
{
  prev:`${host}${resource}?offset=${prevOffset}&limit=${limit}`,
  next:`${host}${resource}?offset=${nextOffset}&limit=${limit}`,
  self:`${host}${resource}?offset=${currentOffset}&limit=${limit}`,
  last:`${host}${resource}?offset=${lastOffset}&limit=${limit}`,
}

```

Client side you can use these to iterate over all the pages.
If there is no next or prev page or you are already on the last page then those fields are not included in the return value.
