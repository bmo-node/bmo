# @lmig/bmo-vue-token

This module implements a Vue Component that retrieves a valid token from the Auth Service.

The component implements an iFrame that listens for an event coming from the Auth Service.

This component requires two props to be passed to it: a host url and an onAuthenticated function:

```
// App.vue
<template>
  <div id="app">
    <div v-if="!token">
      <TokenLoader host="https://auth-service-develop.np.uscm.libertyec.com" :onAuthenticated="onAuthenticated"/>
    </div>
    <HelloWorld v-else :token="token" />
  </div>
</template>

```

This component can be imported as follows:

```
// App.vue
<script>
import TokenLoader from '@lmig/bmo-vue-token';

export default {
  name: 'app',
  components: {
    TokenLoader
  },
  methods: {
    onAuthenticated(token) {
      //do what you want with the token
    }
  }
}
</script>

```
