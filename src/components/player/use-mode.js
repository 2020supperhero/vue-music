import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant.js'

export const userMode = function() {
  console.log('PLAY_MODE-->', PLAY_MODE)
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
    ? 'icon-sequence' : playModeVal === PLAY_MODE.random
    ? 'icon-random' : 'icon-loop'
  })
  const changeMode = function() {
    const mode = (playMode.value + 1) % 3
    console.log('mode--->', mode)
    store.dispatch('changeMode', mode)
  }
  return {
    modeIcon,
    changeMode
  }
}
