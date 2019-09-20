<template>
  <div class="token">
      <iframe hidden v-bind:src="`${$props.host}/api/token/v1`"></iframe>
  </div>
</template>

<script>
export default {
  name: 'TokenLoader',
  props: {
    host: String,
    onAuthenticated: Function
  },
  mounted(){
    window.addEventListener('message', this.listener)
  },
  unmounted(){
    window.removeEventListener('message', this.listener)
  },
  methods: {
    listener(event){
      if (event.origin.startsWith(this.$props.host)) {
        this.$props.onAuthenticated(event.data.token)
      } else {
        return;
      }
    }
  }
}
</script>
