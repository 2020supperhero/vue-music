<template lang="pug">
.top-list(v-loading="loading")
  scroll.top-list-content
    ul
      li.item(
        v-for="item in topList"
        :key="item.id"
        @click="selectItem(item)"
      )
        .icon
          img(
            width="100"
            height="100"
            v-lazy="item.pic"
          )
        ul.song-list
          li.song(
            v-for="song, index in item.songList"
            :key="song.id"
          )
            span {{ index + 1 }}.
            span {{ song.songName }}-{{song.singerName}}
  router-view(v-slot="{ Component }")
    transition(apper name="slide")
      component(:is="Component" :data="selectedTop")
</template>

<script>
import Scroll from '@/components/wrap-scroll'
import { getTopList } from '@/service/top-list.js'
import storage from 'good-storage'
import { TOP_KEY } from '@/assets/js/constant'

export default {
  name: 'top-list',
  components: {
    Scroll
  },
  data() {
    return {
      topList: [],
      loading: true,
      selectedTop: null
    }
  },
  async created () {
    const result = await getTopList()
    this.topList = result.topList
    this.loading = false
  },
  methods: {
    selectItem(top) {
      this.selectedTop = top
      this.cacheTop(top)
      this.$router.push({
        path: `/topList/${top.id}`
      })
    },
    cacheTop(top) {
      storage.session.set(TOP_KEY, top)
    }
  }
}
</script>

<style lang="scss" scoped>
.top-list {
  position: absolute;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      height: 100px;
      padding-top: 20px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
