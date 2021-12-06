<template lang="pug">
m-header
tab
router-view
</template>
<script>
import MHeader from '@/components/header/header.vue'
import Tab from './components/Tab.vue'

export default {
  components: {
    MHeader,
    Tab
  }
}
</script>
<style lang="scss">

</style>
