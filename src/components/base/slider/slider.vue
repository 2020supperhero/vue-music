<template lang="pug">
.slider(ref="rootRef")
  .slider-group
    .slider-page(v-for="item in sliders")
      a(:href="item.link")
        img(:src="item.pic")
  .dots-wrapper
    span.dot(v-for="item, index in sliders" :class="{'active': curIndex === index}")
</template>

<script>
import { ref } from 'vue'
import { useSlider } from './use-slider'

export default {
  props: {
    sliders: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const rootRef = ref(null)
    console.log(useSlider)
    const { curIndex } = useSlider(rootRef)
    return {
      rootRef,
      curIndex
    }
  }
}
</script>

<style lang="scss" scoped>
  .slider {
    // min-height: 1px;
    font-size: 0;
    touch-action: pan-y;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        a {
          display: block;
          width: 100%;
        }
        img {
          display: block;
          // width: 300px;
          width: 100%;
          // height: auto;
        }
      }
    }
    .dots-wrapper {
      position: absolute;
      left: 50%;
      bottom: 12px;
      line-height: 12px;
      transform: translateX(-50%);
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        transform: translateZ(1px);
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
  }
</style>
