import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('@/views/Recommend'/* webpackChunkName: "recommend" */)
const Search = () => import('@/views/Search'/* webpackChunkName: "search" */)
const Singer = () => import('@/views/Singer'/* webpackChunkName: "singer" */)
const TopList = () => import('@/views/TopList'/* webpackChunkName: "topList" */)
const SingerDetail = () => import('@/views/singer-detail' /* webpackChunkName: "singerDetail" */)
const Album = () => import('@/views/album.vue' /* webpackChunkName: "album" */)
const TopDetail = () => import('@/views/top-detail.vue' /* webpackChunkName: "topDetail" */)
const UserCenter = () => import('@/views/user-center.vue' /* webpackChunkName: "userCenter" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/topList',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
