import { get } from './base'

export const getRecommend = function () {
  return get('/api/getRecommend')
}

export const getAlbum = function(album) {
  return get('/api/getAlbum', {
    id: album.id
  })
}
