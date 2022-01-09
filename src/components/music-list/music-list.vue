<template lang="pug">
.music-list
  .back
    i.icon-back(@click="onBack")
  h1.title {{ title }}
  .bg-image(
    :style="bgImageStyle"
    ref="bgImage"
    )
    div.filter(:style="filterStyle")
    .play-btn-wrapper(:style="playBtnPlay")
      .play-btn(@click="random" v-show="songs.length > 0")
        i.icon-play
        span.text 随机播放全部
  scroll.list(
    :style="scrollStyle"
    v-loading="loading"
    :probe-type="3"
    @scroll="onScroll"
    v-no-result:[noResultText]="noResult"
    )
    .song-list-wrapper
      song-list(
        :songs="songs"
        :rank="rank"
        @select="selectItem")
</template>

<script>
import Scroll from '@/components/wrap-scroll'
import SongList from '@/components/base/song-list/song-list.vue'
import { mapActions, mapState } from 'vuex'

const RESERVED_HEIGHT = 55

export default {
  components: {
    Scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    pic: {
      type: String,
      default: ''
    },
    loading: Boolean,
    rank: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    }
  },
  data() {
    return {
      imagHeight: 0,
      scrollY: 0,
      maxTranslateY: 0,
      noResult1: true
    }
  },
  computed: {
    bgImageStyle() {
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0
      let scale = 1

      if (this.scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }

      if (this.scrollY < 0) {
        scale = 1 + Math.abs(this.scrollY / this.imagHeight)
      }

      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },
    scrollStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        top: `${this.imagHeight}px`,
        bottom
      }
    },
    filterStyle() {
      let blur = 0
      const scrollY = this.scrollY
      const maxTranslateY = this.maxTranslateY
      if (scrollY >= 0) {
        blur = Math.min(this.maxTranslateY / maxTranslateY, scrollY / maxTranslateY) * 20
      }
      return {
        filter: `blur(${blur}px)`
      }
    },
    noResult() {
      return !this.loading && !this.songs.length
    },
    playBtnPlay() {
      let display = ''
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return {
        display
      }
    },
    ...mapState([
      'playList'
    ])

  },
  mounted() {
    this.imagHeight = this.$refs.bgImage.clientHeight
    // 最大滚动高度
    this.maxTranslateY = this.imagHeight - RESERVED_HEIGHT
  },
  methods: {
    onBack() {
      this.$router.back()
    },
    onScroll(pos) {
      this.scrollY = -pos.y
    },
    selectItem({ song, index }) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay(this.songs)
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 10px;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 10px;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(7, 17, 27, 0.4);
    }
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 20px;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        font-size: $font-size-small;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    // overflow: hidden;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
