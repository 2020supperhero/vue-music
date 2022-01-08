import { get } from './base'

export const getHotKeys = function() {
  return get('/api/getHotKeys')
}

export const search = function(query, page, showSinger) {
  return get('/api/search', {
    query,
    page,
    showSinger
  })
}
