import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export const useLyric = function ({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricListRef = ref(null)
  const lyricScrollRef = ref(null)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')

  const store = useStore()
  const curentSong = computed(() => store.getters.currentSong)

  watch(curentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    // 防止频繁切歌导致歌词来回跳动
    stopLyric()
    // 切歌的时候要初始化一下
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })

    // 请求歌词过程中切歌
    if (curentSong.value.lyric !== lyric) {
      return
    }

    // 歌词播放的时候执行handleLyric回调函数
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      // 歌曲准备好之后就播放歌词
      if (songReady.value) {
        playLyric()
      }
    } else {
      pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g)
    }
  })
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    // 没有歌词不滚动
    if (!listEl) {
      return
    }

    // 播放到第5行次啊开始滚动
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  // 播放歌词
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }
  // 停止歌词播放
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }
  return {
    currentLyric,
    currentLineNum,
    playLyric,
    lyricScrollRef,
    lyricListRef,
    stopLyric,
    pureMusicLyric,
    playingLyric
  }
}
