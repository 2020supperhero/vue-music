import { createApp } from 'vue'
import Loading from './loading'
import { removeClass, addClass } from '@/assets/js/dom.js'
const relativeCls = 'g-relative'

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    // 将instance挂到el上，下面的updated才可以拿到
    el.instance = instance

    // 获取动态参数
    const title = binding.arg
    // 调用setTitle方法设置参数
    title && instance.setTitle(title)
    // 如果指令有传值的话
    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    const title = binding.arg
    // 调用setTitle方法设置参数
    title && el.instance.setTitle(title)
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

const append = function(el) {
  // 样式对象
  const style = getComputedStyle(el)
  console.log('style==>', style)
  console.log('style==>', style.position)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  el.appendChild(el.instance.$el)
}

const remove = function(el) {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export { loadingDirective }
