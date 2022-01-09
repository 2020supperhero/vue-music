import { useStore } from 'vuex'
import { PLAY_KEY } from '@/assets/js/constant'
import { save } from '@/assets/js/array-store'

export const usePlayHistory = function() {
  const store = useStore()

  const maxLen = 200

  function savePlay(song) {
    const songs = save(song, PLAY_KEY, item => {
      return item.id === song.id
    }, maxLen)

    console.log('setPlayHistory----->', songs)

    store.commit('setPlayHistory', songs)
  }

  return {
    savePlay
  }
}
