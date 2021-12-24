import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util.js'

export const selectPlay = function({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

export const randomPlay = function({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}

export const changeMode = function({ commit, state, getters }, mode) {
  // 因为列表打乱之后，当前的index对应的歌曲就发生改变了，会导致切歌
  // 所以先缓存一下当前歌曲的id，下面修改了
  const currentId = getters.currentSong.id
  // 如果是随机播放，那要打乱播放列表
  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  // 查找当前歌曲在列表的索引
  const index = state.playList.findIndex(song => {
    return song.id === currentId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}
