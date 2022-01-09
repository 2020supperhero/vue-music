<template lang="pug">
teleport(to="body")
  transition(name="slide")
    .add-song(v-show="visible")
      .header
        h1.title 添加歌曲到列表
        .close(@click="hide")
          i.icon-close
      .search-input-wrapper
        search-input(
          v-model="query"
          placeholder="搜索歌曲"
        )
      div(v-show="!query")
        switches(
          :items="['最近播放', '搜索历史']"
          v-model="currentIndex"
        )
        .list-wrapper
          scroll.list-scroll(
            ref="scrollRef"
            v-if="currentIndex===0"
          )
            .list-inner
              song-list(
                :songs="playHistory"
                @select="selectSongBySongList"
                )
          scroll.list-scroll(
            ref="scrollRef"
            v-if="currentIndex === 1"
          )
            .list-inner
              search-list(
                :searches="searchHistory"
                :show-delete="false"
                @select="addQuery"
              )
      .search-result(v-show="query")
        suggest(
          :query="query"
          :show-singer="false"
          @select-song="selectSongBySuggest"
        )
      message(ref="messageRef")
        .message-title
          i.icon-ok
          span.text 1首歌曲已经添加到播放列表
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import SearchInput from '@/components/search/search-input.vue'
import Suggest from '@/components/search/suggest.vue'
import Switches from '@/components/base/switches/switches.vue'
import Scroll from '@/components/wrap-scroll'
import SongList from '@/components/base/song-list/song-list.vue'
import SearchList from '../base/search-list/search-list.vue'
import Message from '@/components/base/messgae/message.vue'
import { useSearchHistory } from '@/components/search/use-search-history.js'

export default {
  components: {
    SearchInput,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    Message
},
  setup() {
    const store = useStore()
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)
    const messageRef = ref(null)

    const searchHistory = computed(() => store.state.searchHistory)
    const playHistory = computed(() => store.state.playHistory)

    watch(query, async (newQuery) => {
      await nextTick()
      refreshScroll()
    })

    const { saveSearch } = useSearchHistory()
    const hide = function() {
      visible.value = false
    }
    const show = async function() {
      visible.value = true
      await nextTick()
      refreshScroll()
    }

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    const addQuery = function(item) {
      query.value = item
    }

    const selectSongBySongList = function({ song }) {
      addSong(song)
    }

    const selectSongBySuggest = function(song) {
      addSong(song)
      saveSearch(query.value)
    }

    function addSong(song) {
      store.dispatch('addSong', song)
      showMessage()
    }

    function showMessage() {
      messageRef.value.show()
    }

    return {
      visible,
      query,
      scrollRef,
      messageRef,
      hide,
      show,
      currentIndex,
      searchHistory,
      playHistory,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest
    }
  }
}
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background-color: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
