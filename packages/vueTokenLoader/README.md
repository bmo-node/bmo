# @lmig/bmo-vue-token

This module implements a Vue Component that retrieves a valid token from the Auth Service.

The component implements an iFrame that listens for an event coming from the Auth Service.

This component requires only one prop to be passed to it: a host url.  You will need a function to be called on the onAuthenticated event, and you can also add an optional third prop to set the interval at which the component will automatically retrieve a new token.

```
// App.vue
<template>
  <div id="app">
    <div v-if="!token">
      <TokenLoader 
        host="https://auth-service-develop.np.uscm.libertyec.com"
        @onAuthenticated="someFunction"
        :interval="<desired refresh>" //this is an optional prop, but should be a number
      />
    </div>
    <HelloWorld v-else :token="token" />
  </div>
</template>
<script>
import TokenLoader from '@lmig/bmo-vue-token';

export default {
  name: 'app',
  components: {
    TokenLoader
  },
  methods: {
    someFunction(token) {
      //do what you want with the token
    }
  }
}
</script>

```
