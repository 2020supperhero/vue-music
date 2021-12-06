import { get } from './base'

export const getRecommend = function () {
  return get('/api/getRecommend')
}
