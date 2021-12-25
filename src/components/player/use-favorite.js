import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-store.js'
import { FAVORITE_KEY } from '@/assets/js/constant.js'

export const useFavorite = function() {
  const store = useStore()
  console.log('store.state-->', store.state)
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  const getFavoriteIcon = function (song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  const toggleFavorite = function (song) {
    let list = []
    if (isFavorite(song)) {
      // 移除
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)
    function compare (item) {
      return item.id === song.id
    }
  }

  const isFavorite = function(song) {
    return ~(favoriteList.value.findIndex(item => {
      return item.id === song.id
    }))
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
