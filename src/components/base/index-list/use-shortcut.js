import { computed, ref } from 'vue'

export const useShortCut = function(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)

  const arrTitle = computed(() => {
    return props.data.map(item => {
      return item.title
    })
  })
  const touch = {}
  // 点击侧边的拼音 跳转到相应的歌手
  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  // 手指滑动 对应到相应的歌手
  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    // 如果点击的其它的地方，则不进行滚动
    if (isNaN(index)) {
      return
    }
    // 防止手指划出界了
    index = Math.max(0, Math.min(arrTitle.value.length - 1, index))
    // 要滚动到的元素
    const targetEl = groupRef.value.children[index]
    // 获取scroll实例
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    arrTitle,
    onShortcutTouchStart,
    scrollRef,
    onShortcutTouchMove
  }
}
