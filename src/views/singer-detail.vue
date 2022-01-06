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
import { createDetailComponent } from '@/assets/js/create-detail-componet'
import { getSingerDetail } from '@/service/singer.js'
import { SINGER_KEY } from '@/assets/js/constant.js'

export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
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
