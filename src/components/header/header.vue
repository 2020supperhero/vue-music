<template lang="pug">
.header
  span.icon
  h1.text Chicken Music
  router-link.mine(to="/user")
    i.icon-mine
</template>

<script>
export default {
  name: 'm-header'
}
</script>

<style lang="scss" scoped>
.header {
  height: 44px;
  text-align: center;
  color: $color-theme;
  // font-size: 0;
  .icon {
    width: 30px;
    height: 32px;
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    margin-right: 9px;
    @include bg-image('logo');
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      padding: 12px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
}
</style>
