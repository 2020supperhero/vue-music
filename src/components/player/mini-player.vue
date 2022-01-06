<template lang="pug">
transition(name="mini")
  .mini-player(
    v-show="!fullScreen && playList.length"
    @click="showNormalPlayer"
    )
    .cd-wrapper
      .cd(ref="cdRef")
        img(
          ref="cdImageRef"
          width="40"
          height="40"
          :src="currentSong.pic"
          :class="cdCls"
        )
    div.slider-wrapper(
        ref="sliderWrapperRef"
      )
      .slider-group
        .slider-page(
          v-for="song in playList"
          :key="song.id"
        )
          h2.name {{ song.name }}
          p.desc {{ song.singer }}
    .control
      progress-circle(
        :radius="32"
        :progress="progress"
        @click.stop="togglePlay"
      )
        i.icon-mini(
          :class="miniPlayIcon"
        )
    .control(
      @click.stop="showPlayist"
    )
      i.icon-playlist
    Playlist(
      ref="playlistRef"
      )
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import ProgressCircle from './progress-circle.vue'
import { useCd } from './use-cd'
import { useMiniSlider } from './use-mini-slider'
import Playlist from './playlist.vue'

export default {
  name: 'mini-palyer',
  components: {
    ProgressCircle,
    Playlist
},
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup(props) {
    const playlistRef = ref(null)
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playList = computed(() => store.state.playList)
    const playing = computed(() => store.state.playing)

    const miniPlayIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    })

    const { cdCls, cdRef, cdImageRef } = useCd()
    const { sliderWrapperRef } = useMiniSlider()

    const showNormalPlayer = function() {
      store.commit('setFullScreen', true)
    }

    const showPlayist = function() {
      playlistRef.value.show()
    }

    return {
      playlistRef,
      fullScreen,
      currentSong,
      playList,
      sliderWrapperRef,
      cdCls,
      cdRef,
      cdImageRef,
      showNormalPlayer,
      miniPlayIcon,
      showPlayist
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background-color: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      width: 100%;
      height: 100%;
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    // .progress-circle {
    //   position: absolute;
    //   right: 15px;
    //   top: 50%;
    //   transform: translateY(-50%);
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
    // }
  }
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
