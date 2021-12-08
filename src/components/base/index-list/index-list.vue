<template lang="pug">
scroll.index-list(:probe-type="3" @scroll="onScroll")
  ul(ref="groupRef")
    li.group(v-for="items in data")
      .title {{ items.title }}
      ul
        li.item(v-for="item in items.list")
          img.avatar(:src="item.pic", alt="")
          span.name {{ item.name }}
  .fixed(v-show="fixedTitle" :style="fixedStyle")
    .fixed-title {{ fixedTitle }}
</template>

<script>
import Scroll from '../scroll/scroll.vue'
import { useFixed } from './use-fixed'

export default {
  name: 'index-list',
  components: {
    Scroll
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { groupRef, onScroll, fixedTitle, fixedStyle } = useFixed(props)

    return {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    &-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
}
</style>
