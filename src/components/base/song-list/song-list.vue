<template lang="pug">
ul.song-list
  li.item(v-for="(song, index) in songs" :key="song.id" @click="selectItem({song, index})")
    .rank(v-if="rank")
      span(:class="getRankCls(index)") {{ getRankText(index)}}
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
    },
    rank: Boolean
  },
  emits: ['select'],
  methods: {
    getDesc(song) {
      return `${song.singer}`
    },
    selectItem({ song, index }) {
      this.$emit('select', { song, index })
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
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
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-image('first')
        }
        &.icon1 {
          @include bg-image('second')
        }
        &.icon2 {
          @include bg-image('third')
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
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
