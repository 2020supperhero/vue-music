import { get } from './base'

export const getHotKeys = function() {
  return get('/api/getHotKeys')
}
