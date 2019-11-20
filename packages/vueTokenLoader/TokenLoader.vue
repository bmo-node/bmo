<template>
  <div class="token">
      <iframe v-if="refresh" hidden v-bind:src="`${$props.host}/api/token/v1`"></iframe>
  </div>
</template>

<script>
export const events = {
	ONAUTHENTICATED: 'onAuthenticated',
	MESSAGE: 'message'
};
export default {
  name: 'TokenLoader',
  props: {
    host: String,
    interval: Number
  },
  data() {
    return {
      refresh: true,
      timerId: null
    }
  },
  mounted() {
    window.addEventListener(events.MESSAGE, this.listener)
  },
  beforeDestroy(){
    window.clearTimeout(this.timerId);
    window.removeEventListener(events.MESSAGE, this.listener)
  },
  methods: {
    listener(event){
      if (event.origin.startsWith(this.$props.host)) {
        if(this.$props.interval !== undefined){
          this.timerId = window.setTimeout(this.enableIFrame, this.$props.interval);
        }
        this.disableIFrame();
        this.$emit(events.ONAUTHENTICATED, event.data.token);
      } else {
        return;
      }
    },
    enableIFrame(){
      window.addEventListener(events.MESSAGE, this.listener)
      this.refresh = true;
    },
    disableIFrame(){
      this.refresh = false;
      window.removeEventListener(events.MESSAGE, this.listener)
    }
  }
}
</script>