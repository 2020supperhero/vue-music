/*
 * 该文件是运行在 Node.js 端的，获取数据的基本的思路就是后端代理，即提供接口路由供前端页面使用，然后在路由内部，我们接收到前端请求后，
    再发送 HTTP 请求到第三方服务接口，携带相应的请求参数，包括签名的参数字段等等。
 * 对于从第三方接口返回的数据，我们会做一层数据处理，最终提供给前端的数据前端可以直接使用，无需再处理。
    这样也比较符合真实企业项目的开发规范，即数据的处理放在后端做，前端只做数据渲染和交互。
 */

const axios = require('axios')
// const pinyin = require('pinyin')
// const Bsse64 = require('js-base64').Base64
// 获取签名方法
const getSecuritySign = require('./sign')
const ERR_OK = 0
const token = 5381

// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl = 'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'
// 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  needNewCode: 0,
  format: 'json',
  platform: 'yqq.json'
}

// 获取一个随机数值
const getRandomVal = function(prefix = '') {
  return prefix + (Math.random() + '').replace('0.', '')
}

// 对 axios get 请求的封装
// 修改请求的 headers 值，合并公共请求参数
const get = function(url, params = {}) {
  return axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/'
    },
    params: Object.assign({}, commonParams, params)
  })
}

// 注册后端路由
const registerRouter = function(app) {
  registerRecommend(app)
}

// 注册推荐列表接口路由
const registerRecommend = function(app) {
  app.get('/api/getRecommend', (req, res) => {
    // 第三方服务接口 url
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    // 构造请求 data 参数
    const data = JSON.stringify({
      comm: { ct: 24 },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: { async: 1, cmd: 2 },
        module: 'playlist.HotRecommendServer'
      },
      focus: { module: 'music.musicHall.MusicHallPlatform', method: 'GetFocus', param: {} }
    })

    // 随机数值
    const randomVal = getRandomVal('recom')
    // const randomVal = getRandomVal('')
    // 计算签名值
    const sign = getSecuritySign(data)
    // const sign = 'zzb4b5adf4emghrndbrslfbaaohgt85qd8c2607f'
    // 发送 get 请求
    get(url, {
      sign,
      '-': randomVal,
      data
    }).then((response) => {
      const data = response.data
      if (data.code === ERR_OK) {
        // 处理轮播图数据
        const focusList = data.focus.data.shelf.v_niche[0].v_card
        const sliders = []
        const jumpPrefixMap = {
          10002: 'https://y.qq.com/n/yqq/album/',
          10014: 'https://y.qq.com/n/yqq/playlist/',
          10012: 'https://y.qq.com/n/yqq/mv/v/'
        }
        // 最多获取 10 条数据
        const len = Math.min(focusList.length, 10)
        for (let i = 0; i < len; i++) {
          const item = focusList[i]
          const sliderItem = {}
          // 单个轮播图数据包括 id、pic、link 等字段
          sliderItem.id = item.id
          sliderItem.pic = item.cover
          if (jumpPrefixMap[item.jumptype]) {
            sliderItem.link = jumpPrefixMap[item.jumptype] + (item.subid || item.id) + '.html'
          } else if (item.jumptype === 3001) {
            sliderItem.link = item.id
          }

          sliders.push(sliderItem)
        }

        // 处理推荐歌单数据
        const albumList = data.recomPlaylist.data.v_hot
        const albums = []
        for (let i = 0; i < albumList.length; i++) {
          const item = albumList[i]
          const albumItem = {}
          // 推荐歌单数据包括 id、username、title、pic 等字段
          albumItem.id = item.content_id
          albumItem.username = item.username
          albumItem.title = item.title
          albumItem.pic = item.cover

          albums.push(albumItem)
        }

        // 往前端发送一个标准格式的响应数据，包括成功错误码和数据
        res.json({
          code: ERR_OK,
          result: {
            sliders,
            albums
          }
        })
      } else {
        res.json(data)
      }
    }).catch(e => {
      console.log('get -->e: ', e)
    })
  })
}

module.exports = registerRouter
