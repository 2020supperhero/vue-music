<template lang="pug">
.no-result
  .no-result-content
    .icon
    p.text {{ title }}
</template>

<script>
export default {
  name: 'no-result',
  data() {
    return {
      title: '抱歉，没有结果'
    }
  },
  methods: {
    setTitle(title) {
      this.title = title
    }
  }
}
</script>

<style lang="scss" scoped>
.no-result {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .no-result-content {
    text-align: center;
    .icon {
      width: 86px;
      height: 90px;
      margin: 0 auto;
      @include bg-image('no-result');
      background-size: 86px 90px;
    }
    .text {
      margin-top: 30px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
}
</style>
