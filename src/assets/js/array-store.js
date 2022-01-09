import storage from 'good-storage'

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFormArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (~index) {
    arr.splice(index, 1)
  }
}

export const save = function(item, key, compare, maxLen) {
  // 没有就默认返回[]
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export const remove = function(key, compare) {
  const items = storage.get(key, [])
  deleteFormArray(items, compare)
  console.log('items-->', items)
  storage.set(key, items)
  return items
}

export const load = function (key) {
  return storage.get(key, [])
}

export const clear = function(key) {
  storage.remove(key)
  return []
}

export const saveAll = function(items, key) {
  storage.set(key, items)
}
