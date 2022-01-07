<template lang="pug">
.search-input
  .icon-search
  input.input-inner(
    v-model.trim="query"
    :placeHolder="placeHolder"
  )
  i.icon-dismiss(
    v-show="query"
    @click="clear"
  )
</template>

<script>
import { debounce } from 'throttle-debounce'

export default {
  name: 'search-input',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeHolder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: this.modelValue
    }
  },
  created () {
    this.$watch('query', debounce(300, newQuery => {
      this.$emit('update:modelValue', newQuery)
    }))

    this.$watch('modelValue', newV => {
      this.query = newV
    })
  },
  methods: {
    clear() {
      this.query = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 0 6px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 1 5px;
    line-height: 18px;
    background-color: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
