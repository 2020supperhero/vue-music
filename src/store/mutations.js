const mutations = {
  // 播放状态
  setPlayingState(state, playing) {
    state.playing = playing
  },
  // 顺序播放列表
  setSquenceList(state, list) {
    state.squenceList = list
  },
  // 设置播放列表
  setPlayList(state, list) {
    state.playList = list
  },
  // 设置播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  // 当前播放索引
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  }
}

export default mutations
