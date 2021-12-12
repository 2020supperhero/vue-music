import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util.js'

export const selectPlay = function({ state, commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sqeuence)
  commit('setSquenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

export const randomPlay = function({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.ramdom)
  commit('setSquenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}
