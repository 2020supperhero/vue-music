<template lang="pug">
scroll.index-list(
  :probe-type="3"
  @scroll="onScroll"
  ref="scrollRef"
  )
  //- 歌手
  ul(ref="groupRef")
    li.group(v-for="items in data")
      .title {{ items.title }}
      ul
        li.item(v-for="item in items.list")
          img.avatar(:src="item.pic", alt="")
          span.name {{ item.name }}
  //- 标题
  .fixed(v-show="fixedTitle" :style="fixedStyle")
    .fixed-title {{ fixedTitle }}
  //- 侧边栏
  // 移动端的触摸 相当于PC端的点击
  .shortcut(
    @touchstart.stop.prevent="onShortcutTouchStart"
    @touchmove.stop.prevent="onShortcutTouchMove"
    @touchend.stop.prevent
    )
    ul
      li.item(
        v-for="itme, index in arrTitle"
        :class="{'current': currentIndex === index}"
        :data-index="index"
        ) {{ itme }}
</template>

<script>
import Scroll from '../scroll/scroll.vue'
import { useFixed } from './use-fixed'
import { useShortCut } from './use-shortcut'

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
    const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } = useFixed(props)
    const { arrTitle, onShortcutTouchStart, scrollRef, onShortcutTouchMove } = useShortCut(props, groupRef)
    console.log(arrTitle)

    return {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle,
      arrTitle,
      currentIndex,
      onShortcutTouchStart,
      scrollRef,
      onShortcutTouchMove
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
  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>
