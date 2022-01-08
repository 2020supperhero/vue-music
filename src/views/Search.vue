<template lang="pug">
.search
  .search-input-wrapper
    search-input(
      v-model="query"
      )
  scroll.search-content(
    ref="scrollRef"
    v-show="!query"
    )
    div
      .hot-keys
        h1.title 热门搜索
        ul
          li.item(
            v-for="item in hotKeys"
            :key="item.id"
            @click="addQuery(item.key)"
          )
            span {{ item.key }}
      .search-history(v-show="searchHistory.length")
        h1.title
          span.text 搜索历史
          span.clear(@click="showConfirm")
            i.icon-clear
        confirm(
          ref="confirmRef"
          text="是否清空所有搜索历史"
          confirm-btn-text="清空"
          @confirm="clearSearch"
        )
        search-list(
          :searches="searchHistory"
          @select="addQuery"
          @delete="deteleSearch"
        )
  .search-result(v-show="query")
    suggest(
      :query="query"
      @select-song="selectSong"
      @select-singer="selectSinger"
      )
  router-view(v-slot="{ Component }")
    transition(apper name="slide")
      component(:is="Component" :data="selectedSinger")

</template>

<script>
import { computed, ref, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Scroll from '@/components/wrap-scroll'
import SearchInput from '@/components/search/search-input.vue'
import SearchList from '@/components/base/search-list/search-list.vue'
import Suggest from '@/components/search/suggest.vue'
import Confirm from '@/components/base/confirm/confirm.vue'
import { getHotKeys } from '@/service/search.js'
import { SINGER_KEY } from '@/assets/js/constant.js'
import storage from 'good-storage'
import { useSearchHistory } from '@/components/search/use-search-history.js'

export default {
    name: 'search',
    components: {
        SearchInput,
        Suggest,
        SearchList,
        Scroll,
        Confirm
    },
    setup() {
      const store = useStore()
      const router = useRouter()
      const query = ref('')
      const hotKeys = ref([])
      const selectedSinger = ref([])
      const scrollRef = ref(null)
      const confirmRef = ref(null)

      const searchHistory = computed(() => store.state.searchHistory)

      watch(query, async (newQuery) => {
        if (!newQuery) {
          await nextTick()
          refreshScroll()
        }
      })

      function refreshScroll() {
        scrollRef.value.scroll.refresh()
      }

      getHotKeys().then(result => {
        hotKeys.value = result.hotKeys
      })

      const { saveSearch, deteleSearch, clearSearch } = useSearchHistory()
      const addQuery = function(item) {
        query.value = item
      }

      const selectSong = function (song) {
        saveSearch(query.value)
        store.dispatch('addSong', song)
      }

      const selectSinger = function(singer) {
        saveSearch(query.value)
        selectedSinger.value = singer
        cacheSinger(singer)
        router.push({
          path: `/search/${singer.mid}`
        })
      }
      function cacheSinger(singer) {
        storage.session.set(SINGER_KEY, singer)
      }

      const showConfirm = function() {
        confirmRef.value.show()
      }

      return {
        scrollRef,
        confirmRef,
        query,
        hotKeys,
        searchHistory,
        addQuery,
        selectSong,
        selectSinger,
        selectedSinger,
        deteleSearch,
        showConfirm,
        clearSearch
      }
    }
}
</script>

<style lang="scss" scoped>
.search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
