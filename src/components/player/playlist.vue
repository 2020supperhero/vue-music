<template lang="pug">
teleport(to="body")
  transition(name="list-fade")
    .playlist(
      v-show="visible && playlist.length"
      @click="hide"
    )
      .list-wrapper(
        @click.stop
      )
        .list-header
          h1.title
            i.icon(
              :class="modeIcon"
              @click.stop="changeMode"
            )
            span.text {{ modeText }}
            span.clear(
              @click="showConfirm"
            )
              i.icon-clear
        scroll.list-content(
          ref="scrollRef"
        )
          transition-group(
            ref="listRef"
            name="list"
            tag="ul"
          )
            li.item(
              v-for="song in sequenceList"
              :key="song.id"
              @click="selectItem(song)"
            )
              i.current(
                :class="getCurrentIcon(song)"
              )
              span.text {{ song.name }}
              span.favorite(
                @click.stop="toggleFavorite(song)"
              )
                i(:class="getFavoriteIcon(song)")
              span.delete(
                :class="{'disable': removing}"
                @click.stop="removeSong(song)"
              )
                i.icon-delete
        .list-footer(
          @click.stop="hide"
        )
          span 关闭
        confirm(
          ref="confirmRef"
          @confirm="confirmClear"
          text="是否清空播放列表"
          confirm-btn-text="清空"
        )
</template>

<script>
import { defineComponent, ref, computed, nextTick, watch } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import Confirm from '@/components/base/confirm/confirm.vue'
import { useStore } from 'vuex'
import { useMode } from './use-mode'
import { useFavorite } from './use-favorite'

export default defineComponent({
  name: 'PlayList',
  components: {
    Scroll,
    Confirm
  },
  setup() {
    const visible = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const removing = ref(false)
    const confirmRef = ref(null)

    const store = useStore()
    const playlist = computed(() => store.state.playList)
    console.log('playlist-->', playlist.value)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    watch(currentSong, async (newSong) => {
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollTopCurrent()
    })
    const hide = function() {
      visible.value = false
    }

    const show = async function() {
      visible.value = true
      await nextTick()
      scrollRefresh()
      scrollTopCurrent()
    }

    const getCurrentIcon = function (song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    const selectItem = function(song) {
      const index = playlist.value.findIndex(item => {
        return song.id === item.id
      })

      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }

    function scrollRefresh() {
      scrollRef.value.scroll.refresh()
    }

    function scrollTopCurrent() {
      const index = sequenceList.value.findIndex(song => {
        return currentSong.value.id === song.id
      })
      if (index === -1) {
        return
      }
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    const removeSong = function(song) {
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      // 播放列表为空的时候，歌曲列表展示会自动隐藏，但是我们需要手动将其置为隐藏
      if (!playlist.value.length) {
        hide()
      }
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    const showConfirm = function() {
      confirmRef.value.show()
    }

    const confirmClear = function() {
      store.dispatch('clearSongList')
      hide()
    }

    return {
      scrollRef,
      confirmRef,
      listRef,
      removing,
      visible,
      playlist,
      modeIcon,
      modeText,
      changeMode,
      sequenceList,
      getFavoriteIcon,
      toggleFavorite,
      hide,
      show,
      getCurrentIcon,
      selectItem,
      removeSong,
      showConfirm,
      confirmClear
    }
  }
})
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity .3s;
    .list-wrapper {
      transition: all .3s;
    }
  }
  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
    }
    .title {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 10px;
        font-size: 24px;
        color: $color-theme-d;
      }
      .text {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .clear {
        @include extend-click();
        .icon-clear {
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background-color: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
  .list-content {
    max-height: 240px;
    overflow: hidden;
    .item {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 30px 0 20px;
      overflow: hidden;
      .current {
        flex: 0 0 20px;
        width: 20px;
        font-size: $font-size-small;
        color: $color-theme-d;
      }
      .text {
        flex: 1;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text-d;
      }
      .favorite {
        @include extend-click();
        margin-right: 15px;
        font-size: $font-size-small;
        color: $color-theme;
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
      .delete {
        @include extend-click();
        font-size: $font-size-small;
        color: $color-theme;
        &.disable {
          color: $color-theme-d;
        }
      }
    }
  }
}
</style>
