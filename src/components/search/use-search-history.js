import { useStore } from 'vuex'
import { SEARCH_KEY } from '@/assets/js/constant'
import { save, remove, clear } from '@/assets/js/array-store.js'

export const useSearchHistory = function() {
  const store = useStore()
  const maxLen = 200

  function saveSearch(query) {
    const searches = save(query, SEARCH_KEY, item => {
      return item === query
    }, maxLen)

    store.commit('setSearchHistory', searches)
  }

  function deteleSearch(query) {
    const searches = remove(SEARCH_KEY, item => {
      return item === query
    })
    store.commit('setSearchHistory', searches)
  }

  function clearSearch() {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deteleSearch,
    clearSearch
  }
}
