import { createApp } from 'vue'
import { removeClass, addClass } from '@/assets/js/dom.js'
const relativeCls = 'g-relative'

export const createloadingLikeDirective = function(Comp) {
  const append = function(el) {
    // 样式对象
    const style = getComputedStyle(el)
    const name = Comp.name
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  const remove = function(el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }

  return {
    mounted(el, binding) {
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div'))
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      // 将instance挂到el[name]上，下面的updated才可以拿到
      el[name].instance = instance

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
      const name = Comp.name
      // 调用setTitle方法设置参数
      title && el[name].instance.setTitle(title)
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}
