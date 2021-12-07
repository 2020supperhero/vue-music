<template lang="pug">
.recommend
  scroll.recommend-content(v-loading="loading")
    div
      .slider-wrapper
        .slider-content
          slider(:sliders="sliders" v-if="sliders.length")
      .command-list
        h1.list-title(v-show="!loading") 热门歌单推荐
        ul
          li.item(v-for="item in albums" @click="selectItem(item)")
            .icon
              img(v-lazy="item.pic" width="60" height="60")
            .text
              h2.name {{ item.username }}
              p.title {{ item.title }}
</template>

<script>
import { getRecommend } from '../service/recommend'
import Slider from '@/components/base/slider/slider.vue'
import Scroll from '@/components/base/scroll/scroll.vue'

export default {
  name: 'recommend',
  components: {
    Slider,
    Scroll
  },
  async created () {
    const result = await getRecommend()
    console.log('result-->', result)
    this.sliders = result.sliders
    this.albums = result.albums
  },
  data() {
    return {
      sliders: [],
      albums: []
    }
  },
  computed: {
    loading() {
      return !this.sliders.length || !this.albums.length
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  &-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .command-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        align-items: center;
        padding: 0 20px 20px 20px;
        box-sizing: border-box;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
