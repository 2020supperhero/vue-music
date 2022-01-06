import { get } from './base'

export const getTopList = function() {
  return get('/api/getTopList')
}

export const getTopDetail = function(top) {
  return get('/api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}
