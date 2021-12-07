export const addClass = function(el, className) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export const removeClass = function(el, className) {
  el.classList.remove(className)
}
