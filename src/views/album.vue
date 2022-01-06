<template lang="pug">
.album
  music-list(
    :songs='songs'
    :title='title'
    :pic='pic'
    :loading="loading"
  )
</template>

<script>
import { createDetailComponent } from '@/assets/js/create-detail-componet'
import { getAlbum } from '@/service/recommend.js'
import { ALBUM_KEY } from '@/assets/js/constant.js'

export default createDetailComponent('ablum', ALBUM_KEY, getAlbum)
</script>

<style lang="scss" scoped>
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
