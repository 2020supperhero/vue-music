import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slider from '@better-scroll/slide'

BScroll.use(Slider)

export const useMiniSlider = function() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const playList = computed(() => store.state.playList)
  const fullScreen = computed(() => store.state.fullScreen)
  const currentIndex = computed(() => store.state.currentIndex)

  // fullScreen为false 且有歌曲的时候
  const sliderShow = computed(() => {
    return !fullScreen.value && !!playList.value.length
  })

  onMounted(() => {
    let sliderVal
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          sliderVal.refresh()
        }
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    watch(playList, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destory()
    }
  })

  return {
    slider,
    sliderWrapperRef
  }
}
