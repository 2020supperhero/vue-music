<template lang="pug">
.singer-detail
  music-list(
    :songs='songs'
    :title='title'
    :pic='pic'
    :loading="loading"
  )
</template>

<script>
import { getSingerDetail } from '@/service/singer.js'
import { porcessSongs } from '@/service/song.js'
import MusicList from '@/components/music-list/music-list.vue'
import { SINGER_KEY } from '@/assets/js/constant.js'
import storage from 'good-storage'

export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  props: {
    singer: Object
  },
  data() {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    computedSinger() {
      let ret = null
      if (this.singer && this.singer.length) {
        ret = this.singer
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY)
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          ret = cachedSinger
        }
      }
      return ret
    },
    pic() {
      const cachedSinger = this.computedSinger
      return cachedSinger && cachedSinger.pic
    },
    title() {
      const cachedSinger = this.computedSinger
      return cachedSinger && cachedSinger.name
    }
  },
  async created() {
    if (!this.computedSinger) {
      const path = this.$route.matched[0].path
      this.$router.push({
        path
      })
      return
    }
    const result = await getSingerDetail(this.computedSinger)
    this.songs = await porcessSongs(result.songs)
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
