<template lang="pug">
ul.song-list
  li.item(v-for="(song, index) in songs" :key="song.id" @click="selectItem({song, index})")
    .content
      h2.name {{ song.name }}
      p.desc {{ getDesc(song) }}
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select'],
  methods: {
    getDesc(song) {
      return `${song.singer}`
    },
    selectItem({ song, index }) {
      this.$emit('select', { song, index })
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
