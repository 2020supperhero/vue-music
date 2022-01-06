<template lang="pug">
.top-list
  music-list(
    :songs='songs'
    :title='title'
    :pic='pic'
    :loading="loading"
    rank
  )
</template>

<script>
import { createDetailComponent } from '@/assets/js/create-detail-componet'
import { getTopDetail } from '@/service/top-list.js'
import { TOP_KEY } from '@/assets/js/constant.js'

export default createDetailComponent('top-detail', TOP_KEY, getTopDetail)
</script>

<style lang="scss" scoped>
.top-list {
  position: fixed!important;
  z-index: 10;
  top: 0!important;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
