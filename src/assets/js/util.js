 export const shuffle = function(list) {
  const arr = list.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandom(i)
    swap(arr, i, j)
  }
  return arr
}

const getRandom = function(max) {
  return Math.floor(Math.random() * (max + 1))
}

const swap = function(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

// 时间格式化
export const formatTime = function(interval) {
  // 向下取整
  interval = interval | 0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = ((interval % 60 | 0) + '').padStart(2, '0')
  return `${minute}:${second}`
}
