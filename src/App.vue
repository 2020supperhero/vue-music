<template lang="pug">
m-header
tab
router-view(:style="viewStyle" v-slot="{ Component }")
  keep-alive
    component(:is="Component")
router-view(
  :style="viewStyle"
  name="user"
  v-slot="{ Component }"
)
  transition(apper name="slide")
    keep-alive
      component(:is="Component")
Player
</template>
<script>
import MHeader from '@/components/header/header.vue'
import Tab from './components/Tab.vue'
import Player from './components/player/player.vue'
import { mapState } from 'vuex'

export default {
  components: {
    MHeader,
    Tab,
    Player
  },
  computed: {
    viewStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState([
      'playList'
    ])
  }
}
</script>
<style lang="scss">

</style>
