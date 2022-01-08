<template lang="pug">
.search
  .search-input-wrapper
    search-input(
      v-model="query"
      )
  .search-content(v-show="!query")
    .hot-keys
      h1.title 热门搜索
      ul
        li.item(
          v-for="item in hotKeys"
          :key="item.id"
          @click="addQuery(item.key)"
        )
          span {{ item.key }}
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
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SearchInput from '@/components/search/search-input.vue'
import Suggest from '@/components/search/suggest.vue'
import { getHotKeys } from '@/service/search.js'
import { SINGER_KEY } from '@/assets/js/constant.js'
import storage from 'good-storage'

export default {
    name: 'search',
    components: {
        SearchInput,
        Suggest
    },
    setup() {
      const store = useStore()
      const router = useRouter()
      const query = ref('')
      const hotKeys = ref([])
      const selectedSinger = ref([])

      getHotKeys().then(result => {
        hotKeys.value = result.hotKeys
      })

      const addQuery = function(item) {
        query.value = item
      }

      const selectSong = function (song) {
        store.dispatch('addSong', song)
      }

      const selectSinger = function(singer) {
        selectedSinger.value = singer
        cacheSinger(singer)
        router.push({
          path: `/search/${singer.mid}`
        })
      }
      function cacheSinger(singer) {
        storage.session.set(SINGER_KEY, singer)
      }

      return {
        query,
        hotKeys,
        addQuery,
        selectSong,
        selectSinger,
        selectedSinger
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
        background-color: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
