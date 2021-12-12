import { PLAY_MODE } from '@/assets/js/constant'

export const state = {
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentindex: 0,
  fullScreen: false
}
