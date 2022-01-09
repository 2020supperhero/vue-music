<template lang="pug">
.player(v-show="playList.length")
  .normal-player(v-show="fullScreen")
    .background
      img(:src="currentSong && currentSong.pic")
    .top
      .back(@click="goBack")
        i.icon-back
      .title {{ currentSong.name }}
      .subtitle {{ currentSong.singer }}
    .middle(
      @touchstart.prevent="onMiddleTouchStart"
      @touchmove.prevent="onMiddleTouchMove"
      @touchend.prevent="onMiddleTouchEnd"
    )
      .middle-l(:style="middleLStyle")
        .cd-wrapper
          .cd(ref="cdRef")
            img.image(
              ref="cdImageRef"
              :class="cdCls"
              :src="currentSong.pic"
              )
        .playing-lyric-wrapper
          .playing-lyric {{ playingLyric }}
      scroll.middle-r(
        ref="lyricScrollRef"
        :style="middleRStyle"
        )
        .lyric-wrapper
          div(
            v-if="currentLyric"
            ref="lyricListRef"
            )
            p.text(
              :class="{'current': currentLineNum === index}"
              v-for="(line, index) in currentLyric.lines"
              :key="line.num"
              ) {{ line.txt }}
          .pure-music(v-show="pureMusicLyric")
            p {{ pureMusicLyric }}

    .bottom
      .dot-wrapper
        span.dot(:class="{'active': currentShow==='cd'}")
        span.dot(:class="{'active': currentShow==='lyric'}")
      .progress-wrapper
        span.time.time-l {{ formatTime(currentTime) }}
        .progress-bar-wrapper
          progress-bar(
            ref="barRef"
            :progress="progress"
            @progress-changing="onProgressChanging"
            @progress-changed="onProgressChanged"
            )
        span.time.time-r {{ formatTime(currentSong.duration) }}
      .operators
        .icon.i-left
          i(:class="modeIcon" @click="changeMode")
        .icon.i-left(:class="disableCls")
          i.icon-prev(@click="prevPlay")
        .icon.i-center(:class="disableCls")
          i(
            :class="playIcon"
            @click="togglePlay"
          )
        .icon.i-right(:class="disableCls")
          i.icon-next(@click="nextPlay")
        .icon.i-right
          i.icon-not-favorite(
            :class="getFavoriteIcon(currentSong)"
            @click="toggleFavorite(currentSong)")
  mini-player(
    :progress="progress"
    :toggle-play="togglePlay"
    )
  audio(
    ref="audioRef"
    @pause="pause"
    @canplay="ready"
    @error="error"
    @timeupdate="updateTime"
    @ended='end'
    )
</template>

<script>
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useMode } from './use-mode'
import { useFavorite } from './use-favorite'
import { useCd } from './use-cd'
import { useLyric } from './use-lyric'
import { useMiddleInteractive } from './use-middle-interactive'
import { usePlayHistory } from './use-play-history'
import ProgressBar from './progress-bar.vue'
import Scroll from '@/components/base/scroll/scroll.vue'
import { formatTime } from '@/assets/js/util.js'
import { PLAY_MODE } from '@/assets/js/constant.js'
import MiniPlayer from './mini-player.vue'

export default defineComponent({
  name: 'player',
  components: {
    ProgressBar,
    Scroll,
    MiniPlayer
  },
  setup() {
    const audioRef = ref(null)
    const barRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)
    let progressChanging = true

    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const currentIndex = computed(() => store.state.currentIndex)
    const playList = computed(() => store.state.playList)
    const playMode = computed(() => store.state.playMode)
    const playing = computed(() => store.state.playing)
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })

    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })

    const progress = computed(() => {
      if (currentSong.value && currentSong.value.duration) {
        return currentTime.value / currentSong.value.duration
      }
      return 0
    })
    watch(currentSong, (newSong, oldSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      currentTime.value = 0
      // 歌曲变化的时候
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
      store.commit('setPlayingState', true)
    })

    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      // 播放
      if (newPlaying) {
        audioEl.play()
        playLyric() // 播放歌词
      } else {
        audioEl.pause()
        stopLyric() // 停止播放歌词
      }
    })

    watch(fullScreen, async (newFullScreen) => {
      if (fullScreen.value) {
        await nextTick()
        barRef.value.setOffset(progress.value)
      }
    })

    // hooks
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdCls, cdRef, cdImageRef } = useCd()
    const {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      playLyric,
      stopLyric
      } = useLyric({ songReady, currentTime })
    const {
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      currentShow,
      middleLStyle,
      middleRStyle
    } = useMiddleInteractive()

    const { savePlay } = usePlayHistory()

    console.log('modeIcon-->', modeIcon.value)
    const goBack = function() {
      store.commit('setFullScreen', false)
    }

    const togglePlay = function() {
      if (!songReady.value) {
        return
      }
      store.commit('setPlayingState', !playing.value)
    }

    // 监听audio的暂停，修改playing的状态
    const pause = function() {
      store.commit('setPlayingState', false)
    }

    // 切换前一首歌
    const prevPlay = function() {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      // 如果只有一首歌 设置为循环播放
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
      }
    }
    // 切换后一首歌
    const nextPlay = function() {
      const list = playList.value
      if (!songReady.value || !list.length) {
        return
      }
      if (list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === playList.value.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
      }
    }
    // 循环播放
    const loop = function() {
      const audioEl = audioRef.value
      // 设置当前的播放进度 单位为秒s
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    // 在开始播放之前回触发该事件
    const ready = function() {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
      savePlay(currentSong.value)
    }

    // 即使当前播放错误 也能切歌
    const error = function() {
      songReady.value = true
    }

    // 监视进度条
    const updateTime = function(e) {
      if (progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    // progress正在改变
    const onProgressChanging = function(progress) {
      progressChanging = true
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      console.log('currentTime.value-->', currentTime.value)
      playLyric() // 先同步歌词
      stopLyric() // 再停止播放
    }

    // 手指松开的时候
    const onProgressChanged = function(progress) {
      progressChanging = true
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      // 手指松开继续播放
      playLyric()
    }

    // 播放结束
    const end = function() {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        nextPlay()
      }
    }

    return {
      /* variate */
      fullScreen,
      currentSong,
      audioRef,
      barRef,
      pause,
      cdCls,
      playIcon,
      progress,
      disableCls,
      modeIcon,
      currentTime,
      cdImageRef,
      cdRef,
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      currentShow,
      middleLStyle,
      middleRStyle,
      playList,
      /* computed */
      goBack,
      togglePlay,
      prevPlay,
      nextPlay,
      ready,
      error,
      changeMode,
      /* methods */
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      updateTime,
      formatTime,
      onProgressChanged,
      onProgressChanging,
      end,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    }
  }
})
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background-color: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-top: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 105px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        // display: none;
        vertical-align: top;
        position: relative;
        width: 100%;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              // height: 100%;
              border-radius: 50%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, .1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      width: 100%;
      position: absolute;
      bottom: 50px;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background-color: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .icon {
          // flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
