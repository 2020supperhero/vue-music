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
