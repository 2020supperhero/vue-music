<template lang="pug">
m-header
tab
router-view
Player
</template>
<script>
import MHeader from '@/components/header/header.vue'
import Tab from './components/Tab.vue'
import Player from './components/player/player.vue'

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>
<style lang="scss">

</style>
