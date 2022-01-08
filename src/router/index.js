import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('@/views/Recommend'/* webpackChunkName: "recommend" */)
const Search = () => import('@/views/Search'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/Singer'/* webpackChunkName: "recommend" */)
const TopList = () => import('@/views/TopList'/* webpackChunkName: "recommend" */)
const SingerDetail = () => import('@/views/singer-detail')
const Album = () => import('@/views/album.vue')
const TopDetail = () => import('@/views/top-detail.vue')

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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
