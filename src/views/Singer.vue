<template lang="pug">
.singer(v-loading="!singers.length")
  index-list(:data="singers" @select="select")
  router-view(v-slot="{ Component }")
    transition(apper name="slide")
      component(:is="Component" :singer="selectSinger")

</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list.vue'
import { SINGER_KEY } from '@/assets/js/constant.js'
import storage from 'good-storage'

export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectSinger: []
    }
  },
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
    console.log('result-->', result)
  },
  methods: {
    select(singer) {
      this.selectSinger = singer
      this.cacheSinger(singer)
      console.log('this.selectSinger-->', this.selectSinger)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
