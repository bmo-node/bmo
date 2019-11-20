<template>
  <div class="token">
      <iframe v-if="refresh" hidden v-bind:src="`${$props.host}/api/token/v1`"></iframe>
  </div>
</template>

<script>

export default {
  name: 'TokenLoader',
  props: {
    host: String,
    onAuthenticated: Function,
    interval: Number
  },
  data() {
    return {
      refresh: true,
      timerId: null
    }
  },
  mounted() {
    window.addEventListener('message', this.listener)
  },
  beforeDestroy(){
    window.clearTimeout(this.timerId);
    window.removeEventListener('message', this.listener)
  },
  methods: {
    listener(event){
      if (event.origin.startsWith(this.$props.host)) {
        if(this.$props.interval !== undefined){
          this.timerId = window.setTimeout(this.enableIFrame, this.$props.interval);
        }
        this.disableIFrame();
        this.$props.onAuthenticated(event.data.token)
      } else {
        return;
      }
    },
    enableIFrame(){
      window.addEventListener('message', this.listener)
      this.refresh = true;
    },
    disableIFrame(){
      this.refresh = false;
      window.removeEventListener('message', this.listener)
    }
  }
}
</script>