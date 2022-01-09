<template lang="pug">
.user-center(
  v-no-result:[noResultText]="noResult"
)
  .back(@click="back")
    i.icon-back
  .switches-wrapper
    switches(
      :items="['我喜欢的', '最近播放']"
      v-model="currentIndex"
    )
  .play-btn(
    v-show="currentList.length"
    @click="random"
    )
    i.icon-play
    span.text 随机播放全部
  .list-wrapper
    scroll.list-scroll(
      v-if="currentIndex === 0"
    )
      .list-inner
        song-list(
          :songs="favoriteList"
          @select="selectSong"
        )
    scroll.list-scroll(
      v-if="currentIndex === 1"
    )
      .list-inner
        song-list(
          :songs="playHistory"
          @select="selectSong"
        )

</template>

<script>
import Switches from '@/components/base/switches/switches.vue'
import Scroll from '@/components/wrap-scroll'
import SongList from '@/components/base/song-list/song-list.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'user-center',
  components: {
    Switches,
    Scroll,
    SongList
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    ...mapState([
      'favoriteList',
      'playHistory'
    ]),
    currentList() {
      return this.currentIndex === 0 ? this.favoriteList : this.playHistory
    },
    noResult() {
      return this.currentIndex === 0 ? !this.favoriteList.length : !this.playHistory.length
    },
    noResultText() {
      return this.currentIndex === 0 ? '暂无收藏歌曲' : '你还没有听过歌曲'
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    selectSong({ song }) {
      this.addSong(song)
    },
    random() {
      this.randomPlay(this.currentList)
    },
    ...mapActions([
      'addSong',
      'randomPlay'
    ])
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  padding-top: 10px;
  background-color: $color-background;
  .back {
    position: absolute;
    top: 10px;
    left: 6px;
    z-index: 50;
    // padding-top: 10px;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border-radius: 100px;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
}
</style>
