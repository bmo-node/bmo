# @lmig/bmo-auth

This module implements an authentication middleware.

Add the following values to your config:

```
auth:{
  host:'https://your.auth.service',
  verifyToken:'/api/token/verify/resource'
}
```

The module issues a put request to the given endpoint
with the following payload:
```
{
  token:'some.jwt.toverify'
}
```
if the service returns a 200 level status code then the
jwt is decoded and attached to userInfo on the requests context.

if the service returns an error the request is returned with a 401 status.
