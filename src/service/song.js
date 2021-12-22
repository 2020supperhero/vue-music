import { get } from './base'

export const porcessSongs = function(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map(song => {
      return song.mid
    })
  }).then(result => {
    const map = result.map
    return songs.map(song => {
      song.url = map[song.mid]
      return song
    }).filter(song => {
      return song.url.indexOf('vkey') > -1
    })
  }).catch(e => {
    console.log('e===>', e)
  })
}
